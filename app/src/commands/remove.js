const { getProjectData } = require('./_common/getProjectData')
const { remove } = require('rise-static/src/internal')

async function main(cli, aws) {
    try {
        projectData = await getProjectData(cli)
    } catch (e) {
        cli.terminal.clear()
        cli.terminal.printErrorMessage('Rise Static Validation Error')
        cli.terminal.printInfoMessage('- ' + e.message)
        return
    }

    const config = {
        name: projectData.name,
        bucketName: projectData.bucketName,
        appId: projectData.apiId,
        region: 'us-east-1',
        stage: 'dev',
        deployName: projectData.name.replace(/\s/g, '') + 'docs',
        auth: projectData.auth && {
            username: projectData.auth.username,
            password: projectData.auth.password
        },
        hiddenFolder: '.docs',
        zip: {
            source: '/' + projectData.distFolder,
            target: '/' + '.docs' + '/',
            zipName: 'app'
        },
        upload: {
            key: 'app.zip'
        },
        deploy: {
            branch: 'main'
        }
    }

    await remove(cli, aws, config)
}

module.exports = main
