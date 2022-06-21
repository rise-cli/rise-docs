exports.writeProject = function writeProject(cli, input) {
    // Generate Command
    cli.filesystem.makeDir('/dist')
    Object.keys(input.pages).forEach((k) => {
        const x = input.pages[k]

        cli.filesystem.writeFile({
            path: '/dist/' + x.htmlFileName,
            content: x.htmlPageContent
        })
    })
}
