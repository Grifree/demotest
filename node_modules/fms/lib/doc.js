var fse = require('fs-extra')
var data = []
var config = require('./config').get()
var iUtil = require('./util')
var marked = require('marked')
var hljs = require('highlight.js')
marked.setOptions({
    highlight: function (code, lang, callback) {
        if (lang) {
            return hljs.highlight(lang, code).value
        }
        else {
            return hljs.highlightAuto(code).value
        }
    }
})
module.exports.addDoc = function (content) {
    switch (typeof content) {
        case 'function':
        content = iUtil.heredoc(content)
        break
        case 'object':
        content = '```js\n' + iUtil.formatJson(JSON.stringify(content) + '```')
        break
        default:
    }
    data.push(marked(content))
}
var getDoc = function () {
    return data.join('')
}
module.exports.getDoc = getDoc
module.exports.docFile = function (path) {
    // 定时是因为需要等待 fms.ajax fms.view 配置完成
    setTimeout(function () {
        var source = fse.readFileSync(__dirname + '/handlebars/doc-html.hbs').toString()
        source = source.replace('{{{content}}}', getDoc())
        fse.outputFile(config.root + path, source, function (err) {
            if (err) {
                console.error('docFile Error')
                console.log(err)
            }
        })
    },10)
}
