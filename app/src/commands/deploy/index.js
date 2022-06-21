const { getProjectData } = require('./getProjectData')
const { deployApplicationBucket } = require('./deploy/deployApplicationBucket')
const { makeDocs } = require('./makeDocs')
const { deployApplication } = require('./deploy/deployApplication')
const { writeProject } = require('./writeProject')
const HIDDEN_FOLDER = '.docs'

async function main(cli, aws) {
    /**
     * Generate Files
     * ----------------------------------------
     */
    // Get Project Data
    const stage = 'dev'
    const region = 'us-east-1'
    let projectData = await getProjectData(cli)

    // Compile Docs
    const compiledProject = makeDocs(projectData)

    // Write lambda files
    writeProject(cli, compiledProject)

    /**
     * Deploy to AWS
     * ----------------------------------------
     */
    // Zip
    await cli.filesystem.zipFolder({
        source: '/' + HIDDEN_FOLDER + '/src',
        target: '/' + HIDDEN_FOLDER + '/lambdas',
        name: 'main'
    })

    // Deploy Bucket
    const deployName = projectData.title.replace(/\s/g, '') + 'docs'
    if (!projectData.bucketName) {
        const bucketName = await deployApplicationBucket(
            cli,
            aws,
            deployName,
            stage
        )
        projectData.bucketName = bucketName
    }

    // Upload Code
    const path = '/' + HIDDEN_FOLDER + '/lambdas/main.zip'
    const uploadFile = await cli.filesystem.getFile(path)
    await aws.s3.uploadFile({
        file: uploadFile,
        bucket: projectData.bucketName,
        key: '/lambdas/main.zip'
    })

    // Deploy Application
    await deployApplication({
        cli,
        aws,
        region: region,
        appName: deployName,
        bucketArn: 'arn:aws:s3:::' + projectData.bucketName,
        stage: stage
    })

    // Update Lambda Code
    await aws.lambda.updateLambdaCode({
        name: deployName + '-docs-' + stage,
        filePath: '/lambdas/main.zip',
        bucket: projectData.bucketName
    })

    const outputName =
        'Endpoint' + projectData.title.split(' ').join('') + 'docs'

    const outputs = await aws.cloudformation.getOutputs({
        stack: deployName + stage,
        outputs: [outputName]
    })

    cli.terminal.clear()
    cli.terminal.printSuccessMessage('Docs Deployed!')
    cli.terminal.printInfoMessage('Endpoint: ' + outputs[outputName])
}

module.exports = main
