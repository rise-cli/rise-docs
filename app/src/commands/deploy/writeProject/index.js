exports.writeProject = function writeProject(cli, input) {
    // Lambda deploy command
    cli.filesystem.makeDir('/.docs')
    cli.filesystem.makeDir('/.docs/src')
    Object.keys(input.pages).forEach((k) => {
        const x = input.pages[k]

        const code = `module.exports = \`${x.htmlPageContent}\``

        cli.filesystem.writeFile({
            path: '/.docs/src/' + x.fileName.replace('.md', '.js'),
            content: code
        })
    })

    const indexCode = `module.exports.handler = async (e) => {
        let page = 'index'
        const path = e.rawPath

        if (path === '/') {
            page = 'index'
        } else {
            page = path.split('.html')[0]
        }

        let html = ""
        try {
            html = require('./' + page + '.js')
        } catch (e) {
            html = "<p>Page Not Found</p>"
        }
        return {
            statusCode: 200,
            "headers": {'Content-Type': 'text/html'},
            body: html
        }
    }`

    cli.filesystem.writeFile({
        path: '/.docs/src/_index.js',
        content: indexCode
    })
}
