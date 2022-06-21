const { makeHiddenFolder } = require('./makeHiddenFolder.js')
async function getBucketInfo(cli) {
    let bucketName = undefined
    try {
        const data = await cli.filesystem.getJsFile('/.docs/data.js')
        bucketName = data.bucketName
    } catch (e) {
        bucketName = undefined
    }
    return bucketName
}

async function getConfig(cli) {
    let config = null
    try {
        config = await cli.filesystem.getJsFile('/docs.js')
    } catch (e) {
        throw new Error('Project must have a docs.js file')
    }

    if (!config.title || typeof config.title !== 'string') {
        throw new Error('doc.js file must have a title defined')
    }

    if (!config.sidebar) {
        throw new Error('doc.js file must have a sidebar defined')
    }

    Object.keys(config.sidebar).forEach((k) => {
        if (typeof config.sidebar[k] !== 'string') {
            throw new Error(
                'doc.js file must have a sidebar whose values are strings'
            )
        }
    })

    return config
}

// function readMdFile(x) {
//     const mdFile = fs.readFileSync(process.cwd() + '/' + x, 'utf8')
//     return mdFile
// }

exports.getProjectData = async function getProjectData(cli) {
    makeHiddenFolder(cli)

    const bucketName = await getBucketInfo(cli)

    const config = await getConfig(cli)

    let projectData = {
        title: config.title,
        bucketName,
        pages: {}
    }

    for (const k of Object.keys(config.sidebar)) {
        const fileName = config.sidebar[k]
        if (fileName === '_index.md') {
            throw new Error('_index.md is a reserved name and cannot be used')
        }

        const pageContent = await cli.filesystem.getTextContent('/' + fileName)

        projectData.pages[fileName] = {
            pageName: k, //fileName.split('.')[0],
            pageContent,
            fileName,
            htmlFileName: fileName.split('.')[0] + '.html'
        }
    }

    // Object.keys(config.sidebar).forEach((k) => {
    //     const fileName = config.sidebar[k]
    //     if (fileName === '_index.md') {
    //         throw new Error('_index.md is a reserved name and cannot be used')
    //     }
    //     const pageContent = await cli.filesystem.getFile(fileName) //readMdFile(fileName)

    //     console.log('>>> ', pageContent)
    //     projectData.pages[fileName] = {
    //         pageName: k, //fileName.split('.')[0],
    //         pageContent,
    //         fileName,
    //         htmlFileName: fileName.split('.')[0] + '.html'
    //     }
    // })

    return projectData
}
