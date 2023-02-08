import * as filesystem from 'rise-filesystem-foundation'
import process from 'node:process'
import { makeHiddenFolder } from './makeHiddenFolder.mjs'

async function getLocalBucketName() {
    try {
        const { config } = await filesystem.getJsFile({
            path: '/.rise/data.mjs',
            projectRoot: process.cwd()
        })

        return config.bucketName
    } catch (e) {
        return undefined
    }
}
async function getConfig() {
    let config = null
    try {
        config = await filesystem.getJsFile({
            path: '/rise.mjs',
            projectRoot: process.cwd()
        })

        config = config.default
    } catch (e) {
        throw new Error('Project must have a rise.mjs file')
    }

    if (!config.name || typeof config.name !== 'string') {
        throw new Error('rise.mjs file must have a name defined')
    }

    if (!config.sidebar) {
        throw new Error('rise.mjs file must have a sidebar defined')
    }

    Object.keys(config.sidebar).forEach((k) => {
        if (typeof config.sidebar[k] !== 'string') {
            throw new Error(
                'rise.mjs file must have a sidebar whose values are strings'
            )
        }
    })

    return config
}

export async function getProjectData(cli) {
    makeHiddenFolder(cli)

    const bucketName = await getLocalBucketName(cli)

    const config = await getConfig(cli)

    let projectData = {
        name: config.name,
        logo: config.logo || '',
        bucketName,

        pages: {},
        distFolder: 'dist'
    }

    for (const k of Object.keys(config.sidebar)) {
        const fileName = config.sidebar[k]
        if (fileName === '_index.md') {
            throw new Error('_index.md is a reserved name and cannot be used')
        }

        const pageContent = await filesystem.getTextContent({
            path: '/' + fileName,
            projectRoot: process.cwd()
        })

        projectData.pages[fileName] = {
            pageName: k,
            pageContent,
            fileName,
            htmlFileName: fileName.split('.')[0] + '.html'
        }
    }

    return projectData
}
