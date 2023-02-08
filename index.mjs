#! /usr/bin/env node
import * as cli from 'rise-cli-foundation'
import { getProjectData } from './utils/01_getProjectData/index.mjs'
import { makeDocs } from './utils/02_makeDocs/index.mjs'
import { writeProject } from './utils/03_writeFile/writeProject.mjs'
import { writeCode } from './utils/03_writeFile/writeCode.mjs'
import { deploy } from './utils/04_deploy/index.mjs'

cli.addCommand({
    command: 'deploy',
    description: 'Deploy functions',
    flags: [
        {
            flag: '--stage',
            default: 'dev'
        },
        {
            flag: '--region',
            default: 'us-east-1'
        },
        {
            flag: '--ci',
            default: 'false'
        }
    ],
    action: async (flags) => {
        let data = await getProjectData()

        let projectData = {
            ...data,
            region: flags.region,
            stage: flags.stage,
            deployInfra: true
        }
        const compiledProject = await makeDocs(projectData)
        await writeProject(compiledProject)
        await writeCode(compiledProject)
        await deploy(projectData)
    }
})

cli.runProgram()
