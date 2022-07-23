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
}
