'use strict'
var $ = require('../index')
var controller = require('./controller')
var handlers = controller.handlers
var combo = require('connect-combo')
var config = require('./config').get()
var _ = require('underscore')

module.exports = function (req, res, next) {
    if (config.password && /(127\.0\.0\.1|localhost)/.test('127.0.0.1')) {
        if (req.cookies._fms_password != config.password) {
            handlers._password(req, res)
            return
        }
    }    
   
    var pathname = req.path
    
    var i = 0
    for(; i < config.urlRewrite.length; i = i + 2) {
        var searchValue = config.urlRewrite[i]
        var replaceValue = config.urlRewrite[i+1]
        if (typeof searchValue === 'string') {
            // "/_console/" = "\/_console\/"
            searchValue = searchValue.replace(/([.$^{[(|)*+?\/\\])/g,'\\$1')
            searchValue = new RegExp('^' + searchValue + '$')
        }
        pathname = pathname.replace(searchValue, replaceValue)
    }
    if (/\?\?/.test(req.url)) {
        combo({
          directory: config.static,
          proxy: false,
          cache: true,
          log: true,
          static: true
        })(req, res)
        return false
    }
    if (pathname === '/') {
        // View 中未配置 url 为 '/' 的模拟模板渲染
        if (!handlers['/']) {
            controller.handlers['_index'](req, res, next)
            return 
        }
    }
    var handler = handlers[pathname]
    switch (typeof handler) {
        case 'function':
            handler(req, res, next)
        break
        case 'object':
            var type
            if (req.xhr) {
                type = 'ajax'
            }
            else if (!_.isEmpty(handler['view'])) {
                type = 'view'
            }
            // 当没有 view 存在时使用 ajax 的 function 因为偶尔需要直接打开 url 查看 GET 方式 AJAX 的响应内容
            else {
                type = 'ajax'
            }

            if (handler[type]) {
                // handler['ajax']['get']
                if (handler[type][req.method]) {
                    handler[type][req.method](req, res, next)
                }
                else {
                    next()
                }
            }
            else {
                next()
            }
        break
        default:
            handlers['_static'](req, res, next, pathname)
    }
}