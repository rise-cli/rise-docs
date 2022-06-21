const makeCli = require('rise-cli-foundation')
const makeRiseAws = require('rise-aws-foundation')
const deploy = require('./commands/deploy/index.js')
const generate = require('./commands/deploy/generate.js')

module.exports = (projectRoot) => {
    /**
     * Setup CLI
     */
    const cli = makeCli({
        type: 'real',
        projectRoot: projectRoot
    })

    const riseAws = makeRiseAws({
        type: 'real'
    })

    /**
     * Setup CLI Commands
     */
    cli.terminal.makeCommand({
        command: 'deploy',
        description: 'Deploy Docs to AWS',
        action: (flags) => {
            deploy(cli, riseAws, flags)
        }
    })

    cli.terminal.makeCommand({
        command: 'generate',
        description: 'Generate Docs in a /docs folder locally',
        action: (flags) => {
            generate(cli, riseAws, flags)
        }
    })

    /**
     * Start
     */
    return cli.terminal.start
}
