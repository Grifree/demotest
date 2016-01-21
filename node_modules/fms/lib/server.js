'use strict'
var $ = require('../index')
var colors = require('colors')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var config = require('./config').get()
var route = require('./route')
var http = require('http')
var cors = require('cors')

var startlog = function (port) {
    console.log('[F.M.S] Running at ' + ('http://127.0.0.1:' + port).cyan);
}


var oSuccessMsgTimer

module.exports = function callee() {
    var server
    var app = require('express')()

    if(config.CORS){
      app.use(cors())
    }

    app.use(cookieParser())
         .use(bodyParser.urlencoded({extended: false}))
         .use(bodyParser.json())
         // 提取 在浏览器中可视化操作的 cookie
         .use(function (req, res, next) {
            if (req.cookies.fms) {
              req.cookies.fms = JSON.parse(req.cookies.fms)
            } else {
              req.cookies.fms = {};
            }
            next()
        })
        .use(config.connect)
        .use(route)
    server =  http.createServer(app).listen(config.port)
    $._set('app', app)
    // 延迟显示启动成功提示，如果 server 端口被占用则取消当前提示
    oSuccessMsgTimer = setTimeout(function () {
        startlog(server.address().port)
    }, 0)
    server.on('error', function (err) {
        clearTimeout(oSuccessMsgTimer);
        if (err.code === 'EADDRINUSE') {
            var oldPort = config.port
            config.port = config.port + 1
            console.log(('Port: ' + oldPort + ' eaddrinuse Switch port: ' + config.port).yellow);
            callee()
        } else {
          throw err;
        }
    })
}