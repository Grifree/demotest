module.exports = {
    res: function (settings) {
        // /user/`ajax`get`err
        settings = settings.split('`')
        var url = settings[0]
        var mode = settings[1]
        var method = settings[2].toUpperCase()
        var response = settings[3]

        var cookie = {}
        // cookie['/user/']['ajax']['type'] = 'err'
        cookie[url] = {}
        cookie[url][mode] = {}
        cookie[url][mode][method] = response
        return 'fms=' + JSON.stringify(cookie)

    }
}