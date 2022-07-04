const { marked } = require('marked')
const shell = require('./shell.js')

marked.setOptions({
    renderer: new marked.Renderer(),
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
})

const addClassToPreTags = (html) => {
    const options = [
        (html) =>
            html.replace(
                /<pre><code class="hljs language-js">/g,
                '<pre class="hljs language-js"><code class="hljs language-js">'
            ),
        (html) =>
            html.replace(
                /<pre><code class="hljs language-ts">/g,
                '<pre class="hljs language-js"><code class="hljs language-ts">'
            ),
        (html) =>
            html.replace(
                /<pre><code class="hljs language-rs">/g,
                '<pre class="hljs language-js"><code class="hljs language-rs">'
            )
    ]

    let result = html
    options.forEach((fn) => {
        result = fn(result)
    })

    return result
}

function handleMarkdownFile(x, projectData) {
    const html = marked.parse(x.pageContent)
    const withPre = addClassToPreTags(html)

    const result = shell({
        body: withPre,
        pages: projectData.pages,
        pageName: x.pageName,
        docsTitle: projectData.title,
        logo: projectData.logo
    })

    return result
}

exports.makeDocs = function makeDocs(projectData) {
    let compiledProjectData = {
        title: projectData.title,
        pages: {}
    }

    Object.keys(projectData.pages).forEach((k) => {
        const data = projectData.pages[k]
        const htmlContent = handleMarkdownFile(data, projectData)

        compiledProjectData.pages[k] = {
            pageName: data.pageName,
            htmlPageContent: htmlContent,
            fileName: data.fileName,
            htmlFileName: data.htmlFileName
        }
    })

    return compiledProjectData
}
