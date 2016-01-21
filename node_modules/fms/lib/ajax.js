'use strict'
var $ = require('../index')
var iUtil = require('./util')
var extend = require('extend')
var colors = require('colors')
var controller = require('./controller')
var mime =require('mime')
var config = require('./config').get()
var doc = require('./doc').addDoc
var Handlebars = require('handlebars')
var _ = require('underscore')
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

var ajaxTpl = Handlebars.compile(iUtil.heredoc(config.ajax.docTemplate))
var ajax = function (url, settings) {
    settings = settings || {}
    if (typeof url === "string") {
        settings.url = url
    }
    // setings is object
    else {
        settings = url
    }

    var handler
    var sContentType

    settings.url = iUtil.checkUrl(settings.url)
    // url 错误时会返回 false
    if (!settings.url){
        return false
    }

    settings.timeout = settings.timeout || config.ajax.timeout
    settings.dataType = settings.dataType || config.ajax.dataType
    settings.type = settings.type || config.ajax.type
    settings.res = settings.res || {}
    settings.resStatus = settings.resStatus || {}
    // 多一步 copy 的原因是防止 config.ajax.resStatus 被覆盖
    var resStatus = extend({}, config.ajax.resStatus)
    extend(resStatus, settings.resStatus)
    settings.resStatus = resStatus
    var key
    for (key in config.ajax.res) {
        if (typeof settings.res[key] === 'undefined') {
            settings.res[key] = config.ajax.res[key]
        }
    }
    
    // 如果某个属性设置为 false 则表示不需要这个状态
    // 我们会在 run(settings) 中配置 ajax 的默认参数
    // 如果某个AJAX只需要 ok 一种状态
    /*
        res: {
            ok: {
                name: 'fms'
            },
            err: false
        }
    */
    _.each(settings.res, function (value, key) {
        if (value === false) {
            delete settings.res[key]
        }
    })
    

    // post => POST , get => GET
    settings.type = settings.type.trim().toUpperCase()

    if (!/^(GET|POST|PUT|DELETE)$/.test(settings.type)) {
        console.log('----------------------------------------'.grey)
        console.log('settings.type: '.red + settings.type + ' Parameter error !'.red)
        console.log('----------------------------------------'.grey)
        throw "settings.type allow only 'get' 'post' 'put' 'delete' !"
    }

    // json ==> application/json , text ==> text/html
    sContentType = mime.lookup(settings.dataType)
    // 如果发现是 RESTful 则使用 express 的 use 添加到路由
    if (/:/.test(settings.url)) {
        $.app.use(settings.url, function (req, res) {
            // 添加到路由后调用对应的 handlers 
            // handlers['/user/:id']
            controller.handlers[settings.url]['ajax'][req.method](req, res)
        })
    }
    controller.handle(settings.url, 'ajax', settings, function (req, res) {
        // settings.url 有可能是 RESTful /user/:id
        iUtil.namespace([settings.url, 'ajax'], req.cookies.fms)
        var resType = req.cookies.fms[settings.url]['ajax'][settings.type] || 'ok'
        var resBody = settings.res[resType]
        // 控制 AJAX 成功失败的 cookie 值在 res 中找不到时
        if (resBody === undefined) {
            var key
            for(key in settings.res) {
                resBody = settings.res[key]
            }
        }
        // 递归将 res.ok res.err 转换为字符串或 function 默认返回的 undefined
        ;(function translateResponse () {
            switch (typeof resBody) {
                case 'string':
                break
                case 'function':
                    resBody = resBody(req, res)
                    // responseResult could be Number Object                    
                    translateResponse()
                break
                case 'object':                
                    resBody = JSON.stringify(resBody)
                break
                case 'number':
                    resBody = String(resBody)
                break
                default:
            }
        })()
        /*
        resBody = function(res, res){
            res.send('message')
        }
        resBody() === undefined
        如果 resBody 是 undefined 则表示已经使用了 res.send 之类方法 响应了请求
        @todo
        文档：当 res.some 是 function 时如果没有 res.send 没有return undefined 以外的值则会一直无响应
        */

        if (resBody !== undefined) {
            setTimeout(
                function() {
                    // 如果 config.ajax.resStatus 只配置了 ok err,而使用者使用了 res: {wait: 1,stop:2} 则会找不到 resStatus['wait']
                    settings.resStatus[resType]  = settings.resStatus[resType] || 200
                    res.status(settings.resStatus[resType])
                    if (settings.dataType === 'jsonp') {
                        res.jsonp(JSON.parse(resBody))
                    } else {
                        res.set({
                            "Content-Type": sContentType
                        })
                        res.send(resBody)
                    }
                },
                settings.timeout
            )
        }
    })
    // doc 设置为 false 时不增加文档
    if (settings.doc !== false) {
        settings.doc = settings.doc || {}
        var docSettings = extend(true, {}, settings)
        
        if (settings.doc.res) {
            docSettings.res = settings.doc.res
        }
        docSettings = extend(true, docSettings, settings.doc)

        _.each(docSettings.res, function (value, key) {
            ;(function translateResponse () {
                switch (typeof value) {
                    case 'string':
                    break
                    case 'function':
                        try {
                            value = value()
                        }
                        catch (err) {
                            value = 'Mock Function'
                        }
                        translateResponse()
                    break
                    case 'object':                
                        value = iUtil.formatJson(JSON.stringify(value))
                    break
                    case 'number':
                        value = String(value)
                    break
                    default:
                }
            })()
            docSettings.res[key] = value
        })
        if (typeof docSettings.request === 'object') {
            docSettings.request = iUtil.formatJson(JSON.stringify(docSettings.request))
        }

        doc('<a href="#' + docSettings.url + '!ajax" class="markdown-anchor" data-url="' + docSettings.url + '"name="' + docSettings.url + '!ajax">#</a>\r\n')

        doc(marked(ajaxTpl(docSettings)))
    }
    // 遍历 fms.run(settings) 中的 settings.ajax.res ，根据 res 增加 fms.ajax().ok() 链式 API

    // 读取默认设置，根据默认设置添加链式 API 
    function chainedAPIWarning () {
        console.log('链式API会被启用，详情请阅读：https://github.com/nimojs/fms/issues/36')
    }
    var oCallbackHandler = {
        ok: function (response) {
            settings.res.ok = response
            chainedAPIWarning()
            return this
        },
        err: function (response) {
            settings.res.err = response
            chainedAPIWarning()
            return this
        },
        res: function (ajaxSettingsRes) {
            settings.res = ajaxSettingsRes
            return this
        }
    }
    var key
    for (key in config.ajax.res) {
        // ok err res 已存在不添加
        if (!/^(ok|err|res)$/.test(key)) {
            (function (key){
                oCallbackHandler[key] = function (response) {
                    settings.res[key] = response
                    chainedAPIWarning()
                    return this
                }
            })(key)
        }
    }
    return oCallbackHandler
}

function get (url, settings) {
    settings = settings || {}
    if (typeof url === "string") {
        settings.url = url
    }
    // setings is object
    else {
        settings = url
    }
    settings.type = 'GET'
    return ajax(settings)
}
function post (url,settings) {
    settings = settings || {}
    if (typeof url === "string") {
        settings.url = url
    }
    // setings is object
    else {
        settings = url
    }
    settings.type = 'POST'
    return ajax(settings)
}
function put (url,settings) {
    settings = settings || {}
    if (typeof url === "string") {
        settings.url = url
    }
    // setings is object
    else {
        settings = url
    }
    settings.type = 'PUT'
    return ajax(settings)
}
function ajaxdelete (url,settings) {
    settings = settings || {}
    if (typeof url === "string") {
        settings.url = url
    }
    // setings is object
    else {
        settings = url
    }
    settings.type = 'DELETE'
    return ajax(settings)
}


module.exports = {
    ajax: ajax,
    get: get,
    post: post,
    put: put,
    delete: ajaxdelete
}