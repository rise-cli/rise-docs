//import cli from 'rise-cli-foundation'
const HIDDEN_FOLDER = '.docs'

exports.makeHiddenFolder = async function makeHiddenFolder(cli) {
    const projectPath = ''

    /**
     * Create focus folder
     */
    const projectFolder = cli.filesystem.getDirectories('/')
    if (!projectFolder.includes(HIDDEN_FOLDER)) {
        await cli.filesystem.makeDir(projectPath + '/' + HIDDEN_FOLDER)
    }

    /**
     * Create lambda folder
     */
    const focusFolder = cli.filesystem.getDirectories(
        projectPath + '/' + HIDDEN_FOLDER
    )
    if (!focusFolder.includes('lambdas')) {
        await cli.filesystem.makeDir(
            projectPath + '/' + HIDDEN_FOLDER + '/lambdas'
        )
    }

    /**
     * Create src folder
     */
    if (!focusFolder.includes('src')) {
        await cli.filesystem.makeDir(projectPath + '/' + HIDDEN_FOLDER + '/src')
    }
}
