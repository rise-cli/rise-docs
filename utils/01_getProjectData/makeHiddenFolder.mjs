import * as filesystem from 'rise-filesystem-foundation'
const HIDDEN_FOLDER = '.docs'

export async function makeHiddenFolder() {
    const projectFolder = filesystem.getDirectories({
        path: '/',
        projectRoot: process.cwd()
    })
    if (!projectFolder.includes(HIDDEN_FOLDER)) {
        await filesystem.makeDir({
            path: '/' + HIDDEN_FOLDER,
            projectRoot: process.cwd()
        })
    }
}
