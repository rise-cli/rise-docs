exports.deployApplication = async function deployApplication({
    cli,
    aws,
    region,
    appName,
    bucketArn,
    stage
}) {
    let template = {
        Resources: {},
        Outputs: {}
    }

    /**
     * Make Lamnda CF
     */

    const res = aws.lambda.makeLambda({
        appName: appName,
        name: 'docs',
        stage: stage,
        bucketArn: bucketArn,
        bucketKey: '/lambdas/main.zip',
        env: {},
        handler: '_index.handler',
        permissions: [],
        timeout: 6,
        layers: []
    })

    template.Resources = {
        ...template.Resources,
        ...res.Resources
    }
    template.Outputs = {
        ...template.Outputs,
        ...{
            [`Lambda${'docs'}${stage}Arn`]: {
                Value: {
                    'Fn::GetAtt': [`Lambda${'docs'}${stage}`, 'Arn']
                }
            }
        }
    }

    const endpointCloudformation = aws.apigateway.makeApiGateway({
        endpointName: appName,
        lambdaName: 'Lambdadocsdev', // This refers to the lambdas CloudFormation ID that is given in the template.
        stage: 'dev',
        path: 'docs'
    })

    template.Resources = {
        ...template.Resources,
        ...endpointCloudformation.Resources
    }

    template.Outputs = {
        ...template.Outputs,
        ...endpointCloudformation.Outputs
    }

    await aws.cloudformation.deployStack({
        name: appName + stage,
        template: JSON.stringify(template)
    })

    await aws.cloudformation.getDeployStatus({
        config: {
            stackName: appName + stage,
            minRetryInterval: 5000,
            maxRetryInterval: 10000,
            backoffRate: 1.1,
            maxRetries: 200,
            onCheck: (resources) => {
                cli.terminal.clear()
                cli.terminal.printInfoMessage(
                    JSON.stringify(resources, null, 2)
                )
            }
        }
    })
}
