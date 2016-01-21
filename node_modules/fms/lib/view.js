'use strict'
var extend = require('extend')
var iUtil = require('./util')
var fs = require('fs')
var request = require('request')
var config = require('./config').get()
var doc = require('./doc').addDoc
var controller = require('./controller')
var qs = require('querystring')
var Handlebars = require('handlebars')
var viewTpl = Handlebars.compile(iUtil.heredoc(config.view.docTemplate))
var marked = require('marked')
var hljs = require('highlight.js')
var path = require('path')
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
module.exports = function (settings) {
    var handler
    settings.url = iUtil.checkUrl(settings.url)
    // url 错误时会返回 false
    if (!settings.url){
        return false
    }

    settings.type = settings.type || config.view.type
    // post => POST , get => GET
    settings.type = settings.type.trim().toUpperCase()
    settings.res = settings.res || {}
    settings.data = settings.data || {}
    controller.handle(settings.url, 'view', settings, function (req, res) {
        iUtil.namespace([req.path, 'view'], req.cookies.fms)
        var data = extend(true, {}, config.view.data)
        extend(true, data, settings.data)
        var resType = req.cookies.fms[req.path]['view'][settings.type]
        
        if (resType) {
            var resBody = settings.res[resType]
            extend(false, data, resBody)
        }
        config.view.filter(req, data)
        if (settings.filter) {
            settings.filter(req, data)
        }
        var templateDir = path.join(config.root + config.view.templateDir)
        var viewSettings = {
            template: settings.template,
            templatePath: path.join(templateDir + settings.template),
            templateDir: templateDir,
            templatePluginDir: path.join(config.root + config.view.templatePluginDir),
            data: data
        }
        req.body['_fms'] = JSON.stringify(viewSettings)
        request.post({
            url: config.view.server + '?' + qs.stringify(req.query),
            form: req.body
        }, function (error, response, body) {
            if (error) {
                var content = '<meta charset="UTF-8">'
                if (error.code === 'ECONNREFUSED') {
                    content = content + '<strong>后端渲染脚本端口未启动 | The back-end rendering script port don\'t start</strong><br> Server:<a href="' + config.view.server + '" target="_blank">' + config.view.server + '</a>'
                }
                content = content + '<pre>' + iUtil.formatJson(JSON.stringify(error)) + '</pre>'
                res.send(content)
            }
            else {
                body = body.toString()
                if (req.query.fms === "debug") {
                    body = body + '<!-- FMS Debug\r\n' + iUtil.formatJson(JSON.stringify(data)) + '\r\n-->'
                }
                /*
                remove php strftime()
                <title>Index</title>
                <br />
                <b>Warning</b>:  strftime(): It is not safe to rely on the system's timezone settings. You are *required* to use the date.timezone setting or the date_default_timezone_set() function. In case you used any of those methods and you are still getting this warning, you most likely misspelled the timezone identifier. We selected the timezone 'UTC' for now, but please set date.timezone to select your timezone. in <b>/Users/nimojs/Documents/git/fms-smarty/mock/libs/sysplugins/smarty_internal_templatecompilerbase.php</b> on line <b>347</b><br />
                </head>
                <body>
                */
                body.replace(/<br\s?\/>[\s\S].*?<b>Warning<\/b>[\s\S].*?<br\s?\/>/,'')
                res.send(body)
            }
        })
    })

    
    var docSettings = extend(true, {}, settings)
    if (typeof docSettings.request === 'object') {
        docSettings.request = iUtil.formatJson(JSON.stringify(docSettings.request))
    }
    docSettings.data = iUtil.formatJson(JSON.stringify(docSettings.data))
    doc('<a href="#' + docSettings.url + '!view" class="markdown-anchor" data-url="' + docSettings.url + '"name="' + docSettings.url + '!view">#</a>\r\n')
    doc(marked(viewTpl(docSettings)))

    // 读取默认设置，根据默认设置添加链式 API 
    var oCallbackHandler = {
        ok: function (response) {
            settings.res.ok = response
            return this
        },
        err: function (response) {
            settings.res.err = response
            return this
        },
        res: function (ajaxSettingsRes) {
            settings.res = ajaxSettingsRes
            return this
        }
    }
    return oCallbackHandler
}