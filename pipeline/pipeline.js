module.exports = {
    name: 'rise-docs-pipeline',
    stages: [
        {
            name: 'Source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'GithubRepo',
                    repo: 'rise-docs',
                    owner: 'rise-cli',
                    outputArtifact: 'sourceZip'
                }
            ]
        },
        {
            name: 'Prod',
            actions: [
                {
                    type: 'BUILD',
                    name: 'Test',
                    script: '/test.yml',
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'testZip'
                },
                {
                    type: 'BUILD',
                    name: 'DeployDocumentation',
                    script: '/docs.yml',
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'docZip'
                },
                {
                    type: 'BUILD',
                    name: 'PublishToNpm',
                    script: '/publish.yml',
                    env: {
                        NPM_TOKEN: '@secret.NPM_KEY'
                    },
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'publishedZip'
                }
            ]
        }
    ]
}
