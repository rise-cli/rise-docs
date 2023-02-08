import * as deploycode from 'rise-deploycode'
import { deployInfra } from 'rise-deployinfra'
import * as filesystem from 'rise-filesystem-foundation'
import * as aws from 'rise-aws-foundation'
import * as cli from 'rise-cli-foundation'
import { makeApiGateway } from './makeApiGateway.mjs'
import process from 'node:process'

export async function deploy(config) {
    cli.clear()
    console.time('✅ Deployed Successfully \x1b[2mDeploy Time')
    cli.hideCursor()
    /**
     * Zip Code
     */
    await filesystem.zipFolder({
        source: '/src',
        target: '/zip',
        name: 'main',
        projectRoot: process.cwd() + '/.rise'
    })

    const deployName = config.name.replace(/\s/g, '')
    console.log(config)

    /**
     * Deploy Bucket
     */
    if (!config.bucketName) {
        const bucketName = await deploycode.deployCodeBucket({
            name: deployName,
            stage: config.stage,
            region: config.region
        })

        filesystem.writeFile({
            path: '/.rise/data.mjs',
            content: `export const config = { bucketName: "${bucketName}"}`,
            projectRoot: process.cwd()
        })

        config.bucketName = bucketName
    }

    /**
     * Upload code to S3
     */
    cli.clear()
    cli.startLoadingMessage('Uploading code to AWS S3')
    const file = await filesystem.getFile({
        path: '/.rise/zip/main.zip',
        projectRoot: process.cwd()
    })
    await aws.s3.uploadFile({
        file,
        bucket: config.bucketName,
        key: 'main.zip'
    })
    cli.endLoadingMessage()

    /**
     * Deploy Application
     */
    cli.clear()
    cli.startLoadingMessage('Preparing CloudFormation Template')

    const lambdaResource = aws.lambda.makeLambda({
        appName: deployName,
        name: 'lambda',
        stage: config.stage,
        bucketArn: 'arn:aws:s3:::' + config.bucketName,
        bucketKey: 'main.zip',
        permissions: [],
        handler: '_index.handler'
    })

    const apiResource = makeApiGateway({
        endpointName: deployName + 'api',
        lambdaName: 'Lambdalambda' + config.stage
    })

    const template = {
        Resources: {
            ...apiResource.Resources,
            ...lambdaResource.Resources
        },
        Outputs: {
            ...apiResource.Outputs,
            ...lambdaResource.Outputs
        }
    }

    const res = await deployInfra({
        name: deployName,
        region: config.region,
        stage: config.stage,
        template: JSON.stringify(template),
        outputs: ['Endpoint']
    })

    /**
     * Update Code
     */
    cli.clear()
    cli.startLoadingMessage('Updating Lambda Functions')

    await aws.lambda.updateLambdaCode({
        name: deployName + '-lambda-' + config.stage,
        filePath: 'main.zip',
        bucket: config.bucketName,
        region: config.region
    })

    cli.endLoadingMessage()

    /**
     * Display Result
     */
    cli.clear()
    console.timeEnd('✅ Deployed Successfully \x1b[2mDeploy Time')
    cli.print(res.outputs.Endpoint)
    cli.showCursor()
}
