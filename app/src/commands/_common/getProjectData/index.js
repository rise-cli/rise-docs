const { makeHiddenFolder } = require('./makeHiddenFolder.js')
async function getBucketInfo(cli) {
    let bucketName = undefined
    let appId = undefined
    try {
        const data = await cli.filesystem.getJsFile('/.docs/data.js')
        bucketName = data.bucketName
        appId = data.appId
    } catch (e) {
        bucketName = undefined
    }
    return {
        bucketName,
        appId
    }
}

async function getConfig(cli) {
    let config = null
    try {
        config = await cli.filesystem.getJsFile('/rise.js')
    } catch (e) {
        throw new Error('Project must have a rise.js file')
    }

    if (!config.name || typeof config.name !== 'string') {
        throw new Error('rise.js file must have a name defined')
    }

    if (!config.sidebar) {
        throw new Error('rise.js file must have a sidebar defined')
    }

    Object.keys(config.sidebar).forEach((k) => {
        if (typeof config.sidebar[k] !== 'string') {
            throw new Error(
                'rise.js file must have a sidebar whose values are strings'
            )
        }
    })

    return config
}

exports.getProjectData = async function getProjectData(cli) {
    makeHiddenFolder(cli)

    const { bucketName, appId } = await getBucketInfo(cli)

    const config = await getConfig(cli)

    if (config.auth && !config.auth.username) {
        throw new Error(`rise.js auth must have a username property`)
    }

    if (config.auth && !config.auth.password) {
        throw new Error(`rise.js auth must have a password property`)
    }

    if (
        config.auth &&
        config.auth.password &&
        config.auth.password.length < 8
    ) {
        throw new Error(`rise.js auth password must be at least 8 characters`)
    }

    let projectData = {
        name: config.name,
        logo: config.logo || '',
        bucketName,
        appId,
        pages: {},
        distFolder: 'dist',
        auth: !config.auth
            ? false
            : {
                  username: config.auth.username,
                  password: config.auth.password
              }
    }

    for (const k of Object.keys(config.sidebar)) {
        const fileName = config.sidebar[k]
        if (fileName === '_index.md') {
            throw new Error('_index.md is a reserved name and cannot be used')
        }

        const pageContent = await cli.filesystem.getTextContent('/' + fileName)

        projectData.pages[fileName] = {
            pageName: k,
            pageContent,
            fileName,
            htmlFileName: fileName.split('.')[0] + '.html'
        }
    }

    return projectData
}
