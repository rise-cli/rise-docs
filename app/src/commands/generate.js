const { getProjectData } = require('./_common/getProjectData')
const { makeDocs } = require('./_common/makeDocs')
const { writeProject } = require('./_common/writeProject/writeLocal.js')

async function main(cli) {
    let projectData = await getProjectData(cli)
    const compiledProject = makeDocs(projectData)
    writeProject(cli, compiledProject)
    cli.terminal.printSuccessMessage('Docs Generated!')
}

module.exports = main
