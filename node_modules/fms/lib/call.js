var handlers = require('./controller').handlers
var iUtil = require('./util')
module.exports = function (settings) {
    settings = settings.split('`')

    settings[1] = settings[1] || 'ajax'
    settings[2] = settings[2] || 'GET'
    var url = settings[0]
    var mode = settings[1]
    var type = settings[2].trim().toUpperCase()
    handlers[url] = handlers[url] || {}
    handlers[url][mode] = handlers[url][mode] || {}
    if (handlers[url][mode][type]) {
        return handlers[url][mode][type]
    }
    else {
        return function (req, res) {
            res.status(404).send(url + " not found")
        }
    }
}