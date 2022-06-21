const makeCli = require('rise-cli-foundation')
const makeRiseAws = require('rise-aws-foundation')
const deploy = require('./commands/deploy/index.js')
const generate = require('./commands/deploy/generate.js')

const riseAws = makeRiseAws({
    type: 'real'
})

const makeMockAws = (awsState) => {
    if (!awsState.mutations) {
        awsState.mutations = []
    }

    if (!awsState.willDeploy) {
        awsState.willDeploy = {}
    }

    if (!awsState.deployed) {
        awsState.deployed = {}
    }

    let cfCount = 0
    if (!awsState.cloudformationDeploy) {
        awsState.cloudformationDeploy = ['pending', 'pending', 'success']
    }

    return {
        lambda: {
            makeLambda: riseAws.lambda.makeLambda,
            updateLambdaCode: (props) => {
                awsState.mutations.push({
                    action: 'updateLambdaCode',
                    props: JSON.stringify(props)
                })
            }
        },
        apigateway: {
            makeApiGateway: riseAws.apigateway.makeApiGateway
        },
        cloudformation: {
            deployStack: (props) => {
                awsState.willDeploy = props
            },
            getDeployStatus: (props) => {
                const config = props.config
                const eventsLength = awsState.cloudformationDeploy.length
                while (cfCount <= eventsLength) {
                    if (awsState.cloudformationDeploy[cfCount] === 'pending') {
                        config.onCheck('RESOURCES')
                        cfCount++
                    }

                    if (awsState.cloudformationDeploy[cfCount] === 'success') {
                        awsState.deployed = { ...awsState.willDeploy }
                        break
                    }
                }
            },
            getOutputs: ({ outputs }) => {
                return outputs.reduce((acc, k) => {
                    acc[k] = 'OUTPUT'
                    return acc
                }, {})
            }
        },
        s3: {
            makeBucket: riseAws.s3.makeBucket,
            uploadFile: (props) => {
                awsState.mutations.push({
                    action: 'uploadFile',
                    props: JSON.stringify(props)
                })
            }
        }
    }
}

module.exports = (terminalState, filesystemState, awsState) => {
    /**
     * Setup CLI
     */
    const cli = makeCli({
        type: 'mock',
        terminalState,
        filesystemState
    })

    const riseAws = makeMockAws(awsState)

    /**
     * Setup CLI Commands
     */
    cli.terminal.makeCommand({
        command: 'deploy',
        description: 'Deploy Docs to AWS',
        action: async (flags) => {
            await deploy(cli, riseAws, flags)
        }
    })

    cli.terminal.makeCommand({
        command: 'generate',
        description: 'Generate Docs in a /docs folder locally',
        action: async (flags) => {
            await generate(cli, riseAws, flags)
        }
    })

    /**
     * Start
     */
    return cli.terminal.execute
}
