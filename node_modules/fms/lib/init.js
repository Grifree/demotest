var colors = require('colors')
var extend = require('extend')
var _ = require('underscore')
var path = require('path')

var init = function (settings, settings2) {
    var server = require('./server')

    // 支持 $.run(18080, {}) 语法
    if (typeof settings !== 'object') {
        var settings2 = settings2 || {}
        settings2.port = settings
        settings = settings2
    }
    var defaultConfig = require('./config').get()

    extend(true, defaultConfig, settings)
    var config = defaultConfig
    config.static = path.join(config.static)
    config.root = path.join(config.root)
    // 路径必须以 "/" 为结尾(windows系统是 "\")
    var rDirPath = /(\/|\\)$/
    if (!rDirPath.test(config.root)) {
        config.root = config.root + path.join('/')
    }

    config.static =  config.root + config.static

    // 路径必须以 "/" 为结尾(windows系统是 "\")
    if (!rDirPath.test(config.static)) {
        config.static = config.static + path.join('/')
    }

    // 始终读取项目根目录 HTML 文件
    config.read.push('/')
    config.read = _.uniq(config.read)
    config.port = process.env.PORT || config.port
    require('./config').set(config)
    
    server()
}

module.exports = init