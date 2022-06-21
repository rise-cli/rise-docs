const { getProjectData } = require('./getProjectData')
const { makeDocs } = require('./makeDocs')
const { writeProject } = require('./writeProject/writeLocal.js')

async function main(cli) {
    let projectData = await getProjectData(cli)
    const compiledProject = makeDocs(projectData)
    writeProject(cli, compiledProject)
    cli.terminal.printSuccessMessage('Docs Generated!')
}

module.exports = main
