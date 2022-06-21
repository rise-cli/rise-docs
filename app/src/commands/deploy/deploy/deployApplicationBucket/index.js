exports.deployApplicationBucket = async function deployApplicationBucket(
    cli,
    aws,
    appName,
    stage
) {
    /**
     * Deploy Stack
     */
    const bucketTemplate = aws.s3.makeBucket('Main')
    const stackName = appName + stage + '-bucket'

    await aws.cloudformation.deployStack({
        name: stackName,
        template: JSON.stringify(bucketTemplate)
    })

    await aws.cloudformation.getDeployStatus({
        config: {
            stackName: stackName,
            minRetryInterval: 2000,
            maxRetryInterval: 10000,
            backoffRate: 1.1,
            maxRetries: 200,
            onCheck: () => {
                cli.terminal.clear()
                cli.terminal.printInfoMessage('Creating Bucket...')
            }
        }
    })

    /**
     * Write generated bucket name to local state
     */
    const { MainBucket } = await aws.cloudformation.getOutputs({
        stack: stackName,
        outputs: ['MainBucket']
    })

    cli.filesystem.writeFile({
        path: '/.docs/data.js',
        content: `module.exports = { bucketName: "${MainBucket}"}`
    })

    return MainBucket
}
