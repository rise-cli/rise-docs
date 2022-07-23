const { getProjectData } = require('./_common/getProjectData')
const { makeDocs } = require('./_common/makeDocs')
const { writeProject } = require('./_common/writeProject/writeLocal.js')
const { deploy } = require('rise-static/src/internal')

async function main(cli, aws) {
    let projectData = await getProjectData(cli)
    const compiledProject = makeDocs(projectData)
    writeProject(cli, compiledProject)

    const config = {
        name: projectData.name,
        bucketName: projectData.bucketName,
        appId: projectData.apiId,
        region: 'us-east-1',
        stage: 'dev',
        hiddenFolder: '.docs',
        deployName: projectData.name.replace(/\s/g, '') + 'docs',
        auth: projectData.auth && {
            username: projectData.auth.username,
            password: projectData.auth.password
        },
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

    await deploy(cli, aws, config)
}

module.exports = main
