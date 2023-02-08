import * as filesystem from 'rise-filesystem-foundation'
import process from 'node:process'

export async function writeProject(input) {
    // Generate Command
    await filesystem.makeDir({
        path: '/dist',
        projectRoot: process.cwd()
    })
    
    Object.keys(input.pages).forEach((k) => {
        const x = input.pages[k]

        filesystem.writeFile({
            path: '/dist/' + x.htmlFileName,
            content: x.htmlPageContent,
            projectRoot: process.cwd()
        })  
    })
}
