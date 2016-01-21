'use strict'
                                                                        /*
    Docs - 文档         : http://fmsjs.org
    Demo - 示例      : http://demo.fmsjs.org
    Community - 社区    : https://github.com/nimojs/fms/issues
    Github             : https://github.com/nimojs/fms
    Contact - 联系作者  : nimo.jser[at]gmail.com http://weibo.com/nimojs
    Help - 帮助 : https://github.com/nimojs/fms/issues/new
                                                                        */
var fms = {

}
module.exports = fms
var ajax = require('./lib/ajax')
var doc = require('./lib/doc')
fms.run = require('./lib/init'),
fms.chance = require('chance')
fms.Mock = require('mockjs')
fms.Random = require('mockjs').Random
fms._set = function (name, value) {
    this[name] = value
}
fms.ajax = ajax.ajax
fms.get = ajax.get
fms.post = ajax.post
fms.delete = ajax.delete
fms.put = ajax.put
fms.view = require('./lib/view')
fms.doc = doc.addDoc
fms.docFile = doc.docFile
fms.call = require('./lib/call')