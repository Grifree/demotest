'use strict'
var fs = require('fs')
var _util = require('./util')
var readdir = require('readdir')
var path = require('path')
var Handlebars = require('handlebars')
var mime = require('mime')
var config = require('./config').get()
var eachAsync = require('each-async')
var qrcode = require('iqrcode')
var _ = require('underscore')
var doc = require('./doc')
var readdir = require('readdir')
var eachAsync = require('each-async')
var controller = {
    handlers: {
        /*
        // fms源码中直接定义的函数
        '/function/': function (req ,res) {
            ,
        '/user/': {
            // $.ajax({type: [mehotd]})
            ajax: {
                "GET": fn,
                "POST": fn,
                "PUT": fn,
                "DELETE": fn
            },
            // $.view({type: [mehotd]})
            view: {
                'GET': fn,
                'POST': fn
            }
        }
        */
    },
    getHandList: function () {
        var result = {}
        _.each(this.handlers, function (handle, url) {
            if (handle.ajax || handle.view) {
                _.each(handle, function (handle, type) {
                    _.each(handle, function (fn, method) {
                        _util.namespace([url,type,method], result)
                        result[url][type][method] = {
                            title: fn.title,
                            res: fn.res
                        }
                    })
                })
            }
        })
        return result
    }
}
var regexp = {
    titleTag: /<\s*title\s*>([^<]*)<\/\s*title\s*>/
}
module.exports = controller


controller.handle = function (url, type, settings, fn) {
    var method = settings.type.toUpperCase()
    controller.handlers[url] = controller.handlers[url] || {}
    
    // ['/url/', 'ajax'] ['/url/', 'view'] 
    _util.namespace([url,type], controller.handlers)
    // ['/url/']['ajax']['POST']
    // ['/url/']['view']['GET']
    
    if (controller.handlers[url][type][method]) {
        console.log('------- Trace -------'.grey)
        console.trace('$.' + type + ' ' + url + method + ' is exist!')
        console.log('--------------------'.grey)
        console.log('$.' + type + ' ' + method + ' ' + url.yellow + ' is exist!'.red)
        console.log('--------------------'.grey)
        throw 'url is exist!'
    }

    controller.handlers[url][type] = controller.handlers[url][type] || {}
    // ['/url/']['view']['GET']

    controller.handlers[url][type][method] = fn
    controller.handlers[url][type][method].title = settings.title || ''
    var res = []
    // 为了支持 fms.ajax fms.view 链式调用能传递 res ，需要延迟记录数据
    setTimeout(function () {
        _.each(settings.res, function (value, key) {
            res.push(key)
        })
        controller.handlers[url][type][method].res = res
    }, 0)
}

controller.handlers['_password'] = function (req, res, next) {
    fs.readFile(__dirname + '/handlebars/password-form.hbs', 'utf-8', function (err, sForm) {
        if (err) throw err
        if (req.method === 'GET') {
            res.status(403)
            res.send(sForm)
        }
        else {
            if (req.body.password == config.password) {
                res.cookie('_fms_password', config.password, {
                    path: '/',
                    maxAge: 31536000
                })
                res.redirect(301, req.originalUrl)
            }
            else {
                res.status(403)
                res.send(sForm + 'Password error!')
            }
        }    
    })
}

var staticTemplate
controller.handlers['_static'] = function (req, res, next, pathname) {
    
    var filepath = config.static + pathname
    var handleError = function (err) {
        if (err.code === 'ENOENT')  {
            next()
        }
        else {
            res.status(404).send(err)
        }
    }
    var path = require('path')
    fs.stat(filepath, function (err, stat) {
        if (err) {handleError(err);return}
        // 输出目录列表
        if (stat.isDirectory()) {
            readdir.read(filepath, readdir.INCLUDE_DIRECTORIES + readdir.NON_RECURSIVE, function (err, filesArray) {
                if (err) {handleError(err);return}
                if (!staticTemplate) {
                    fs.readFile(__dirname + '/handlebars/static.hbs', 'utf-8', function (err, source) {
                        if (err) {handleError(err);return}
                        staticTemplate = Handlebars.compile(source)
                        viewDir()
                    })
                }
                else {
                    viewDir()
                }
                function viewDir () {
                    var path = pathname
                    if (!/\/$/.test(path)) {
                        path = path + '/'
                    }
                    var html = staticTemplate({
                        title: pathname,
                        path: path,
                        list: filesArray
                    })
                    res.send(html)
                }
            })
        }
        // 输出文件
        else {
            fs.readFile(filepath, function (err, data) {
                if (err) {handleError(err);return}
                var contentType = mime.lookup(filepath)
                res.set({
                    'Content-Type': contentType
                })
                if(/^text\//.test(contentType)) {
                    data = data.toString()
                    data = config.staticReplace(req, data) || data
                }
                res.send(data)
            })
        }
    })
}

var _getDoc = ''
var consoleHandle = function (req, res, next) {
    var type = req.query.type
    if (typeof req.query['m.js'] !== 'undefined') {
        res.sendFile(__dirname + '/static/js/fms.js')
        return
    }
    switch (type) {
        case 'handle':
        res.json(controller.getHandList())
        break
        case 'read':
        // config.read = ["/", "html"]
        var list = []
        eachAsync(config.read, function (dirname, index, nextEachDir) {
            var filter
            if (dirname === '/') {
                filter = ['*.html', '*.htm']
            }
            else {
                if (dirname.charAt(0) !== '/') {
                    dirname = '/' + dirname
                }
                if (!/\/$/.test(dirname)){
                    dirname = dirname + '/'
                }
                filter = ['**.html', '**.htm']
            }
            readdir.read( config.static + dirname, filter, readdir.INCLUDE_DIRECTORIES, function (err, filesArray) {
                if (err) {
                    if (err.code === 'ENOENT') {
                        list.push({
                            title: dirname,
                            files: []
                        })
                        nextEachDir()
                        return
                    }
                    console.log(err)
                }                
                // filesArray = ['index.html', 'demo.html']
                eachAsync(filesArray, function (filename, index ,next) {
                    var filepath = config.static + dirname  + filename
                    fs.readFile(filepath, 'utf-8', function (err, data) {
                        if (err) console.log(err)                            
                        var aPageTitle = data.match(regexp.titleTag)
                        var sTitle = 'not title'
                        if (aPageTitle) {
                            sTitle = aPageTitle[1]
                        }
                        // index.html = ['首页', 'index.html']
                        filesArray[index] = {
                            title: sTitle,
                            url: dirname + filename,
                            filename: filename.replace(/.*\/(.*)$/, '$1')
                        }
                        next()
                    })
                }, function () {
                    list.push({
                        title: dirname,
                        files: filesArray
                    })
                    // 遍历下一个目录
                    nextEachDir()
                })

            })

        }, function (err) {
        // 完成静态 HTML 的遍历
            if (err) console.log(err)
            res.json(list)        
        })
        break
        case 'doc':
        if (!_getDoc) {
            _getDoc = doc.getDoc()
        }
        res.send(_getDoc)
        break
        case 'qrcode':
            var text = req.query.text
            res.send(qrcode.toDataURL(text, 4))
        break
        case 'fms.css':
            res.sendFile(__dirname + '/static/css/fms.css')
        break
        case 'fms.js':
            res.sendFile(__dirname + '/static/js/fms.js')
        break
        case 'cookie':
            res.sendFile(__dirname + '/static/json.html')
        break
        default:
            res.sendFile(__dirname + '/static/console.html')
    }
}
controller.handlers['_index'] = consoleHandle
controller.handlers['/fms/'] = consoleHandle