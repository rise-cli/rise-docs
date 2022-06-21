const makeApp = require('../src/mockApp')

test('app can deploy docs', async () => {
    let filesystemState = {
        'docs.js': `module.exports = {
    title: "ExampleDocs",
    sidebar: {
        Intro: 'example.md'
    }

}`,
        'example.md': `# Title
## SubTitle
Some text
        `
    }
    let terminalState = []
    let awsState = {}
    const execute = makeApp(terminalState, filesystemState, awsState)
    await execute('deploy')
    expect(terminalState[0]).toBe('Docs Deployed!')
    expect(awsState.mutations).toEqual([
        {
            action: 'uploadFile',
            props: '{"file":"ZIP_FILE","bucket":"OUTPUT","key":"/lambdas/main.zip"}'
        },
        {
            action: 'updateLambdaCode',
            props: '{"name":"ExampleDocsdocs-docs-dev","filePath":"/lambdas/main.zip","bucket":"OUTPUT"}'
        }
    ])

    expect(awsState.deployed).toEqual({
        name: 'ExampleDocsdocsdev',
        template:
            '{"Resources":{"LambdadocsdevLogGroup":{"Type":"AWS::Logs::LogGroup","Properties":{"LogGroupName":"/aws/lambda/ExampleDocsdocs-docs-dev"}},"Lambdadocsdev":{"Type":"AWS::Lambda::Function","Properties":{"Code":{"S3Bucket":"OUTPUT","S3Key":"/lambdas/main.zip"},"FunctionName":"ExampleDocsdocs-docs-dev","Handler":"_index.handler","MemorySize":1024,"Role":{"Fn::GetAtt":["LambdadocsdevRole","Arn"]},"Runtime":"nodejs14.x","Timeout":6,"Environment":{"Variables":{}},"Layers":[]},"DependsOn":["LambdadocsdevLogGroup"]},"LambdadocsdevRole":{"Type":"AWS::IAM::Role","Properties":{"AssumeRolePolicyDocument":{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":["lambda.amazonaws.com"]},"Action":["sts:AssumeRole"]}]},"Policies":[{"PolicyName":"LambdaExampleDocsdocsdocsdevRolePolicy","PolicyDocument":{"Version":"2012-10-17","Statement":[{"Action":["logs:CreateLogStream"],"Resource":[{"Fn::Sub":["arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/ExampleDocsdocs-docs-dev:*",{}]}],"Effect":"Allow"},{"Action":["logs:PutLogEvents"],"Resource":[{"Fn::Sub":["arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/ExampleDocsdocs-docs-dev:*:*",{}]}],"Effect":"Allow"}]}}],"Path":"/","RoleName":"LambdaExampleDocsdocsdocsdevRole"}},"HttpApiExampleDocsdocs":{"Type":"AWS::ApiGatewayV2::Api","Properties":{"Name":"ExampleDocsdocs","ProtocolType":"HTTP"},"DependsOn":"Lambdadocsdev"},"HttpApiStageExampleDocsdocs":{"Type":"AWS::ApiGatewayV2::Stage","Properties":{"ApiId":{"Ref":"HttpApiExampleDocsdocs"},"StageName":"$default","AutoDeploy":true,"DefaultRouteSettings":{"DetailedMetricsEnabled":false}}},"LambdaPermissionHttpApiExampleDocsdocs":{"Type":"AWS::Lambda::Permission","Properties":{"FunctionName":{"Fn::GetAtt":["Lambdadocsdev","Arn"]},"Action":"lambda:InvokeFunction","Principal":"apigateway.amazonaws.com","SourceArn":{"Fn::Join":["",["arn:",{"Ref":"AWS::Partition"},":execute-api:",{"Ref":"AWS::Region"},":",{"Ref":"AWS::AccountId"},":",{"Ref":"HttpApiExampleDocsdocs"},"/*"]]}}},"HttpApiIntegrationExampleDocsdocs":{"Type":"AWS::ApiGatewayV2::Integration","Properties":{"ApiId":{"Ref":"HttpApiExampleDocsdocs"},"IntegrationType":"AWS_PROXY","IntegrationUri":{"Fn::GetAtt":["Lambdadocsdev","Arn"]},"PayloadFormatVersion":"2.0","TimeoutInMillis":6500}},"HttpApiRouteDefaultExampleDocsdocs":{"Type":"AWS::ApiGatewayV2::Route","Properties":{"ApiId":{"Ref":"HttpApiExampleDocsdocs"},"RouteKey":"$default","Target":{"Fn::Join":["/",["integrations",{"Ref":"HttpApiIntegrationExampleDocsdocs"}]]}},"DependsOn":"HttpApiIntegrationExampleDocsdocs"}},"Outputs":{"LambdadocsdevArn":{"Value":{"Fn::GetAtt":["Lambdadocsdev","Arn"]}},"EndpointExampleDocsdocs":{"Description":"URL of the HTTP API","Value":{"Fn::Join":["",["https://",{"Ref":"HttpApiExampleDocsdocs"},".execute-api.",{"Ref":"AWS::Region"},".",{"Ref":"AWS::URLSuffix"}]]}}}}'
    })
})

test('app can generate docs', async () => {
    let filesystemState = {
        'docs.js': `module.exports = {
    title: "ExampleDocs",
    sidebar: {
        Intro: 'example.md'
    }

}`,
        'example.md': `# Title
## SubTitle
Some text
        `
    }
    let terminalState = []
    let awsState = {}
    const execute = makeApp(terminalState, filesystemState, awsState)
    await execute('generate')
    expect(terminalState[0]).toBe('Docs Generated!')
    expect(filesystemState.dist['example.html']).toBeTruthy()
})
