import * as filesystem from 'rise-filesystem-foundation'
import process from 'node:process'

export async function writeCode(input) {
    // Lambda deploy command
    await filesystem.makeDir({
        path: '/.rise',
        projectRoot: process.cwd()
    })
   
    await filesystem.makeDir({
         path: '/.rise/src',
         projectRoot: process.cwd()
    })
    
    Object.keys(input.pages).forEach((k) => {
        const x = input.pages[k]

        const code = `export default \`${x.htmlPageContent}\``
        filesystem.writeFile({
            path: '/.rise/src/' + x.fileName.replace('.md', '.mjs'),
            content: code,
            projectRoot: process.cwd()
        })  
    })

    const indexCode = `export const handler = async (e) => {
        let page = 'index'
        const path = e.rawPath
        if (path === '/') {
            page = 'index'
        } else {
            page = path.split('.html')[0]
        }
        let html = ""
        try {
            const x = await import('./' + page + '.mjs')
            html = x.default
        } catch (e) {
            html = "<p>Page Not Found</p>"
        }
        return {
            statusCode: 200,
            "headers": {'Content-Type': 'text/html'},
            body: html
        }
    }`

    filesystem.writeFile({
        path: '/.rise/src/_index.mjs',
        content: indexCode,
        projectRoot: process.cwd()
    })
}
