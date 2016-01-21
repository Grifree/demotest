var fms = require('fms')
fms.run({
    port: 3005,
    static: './output',
    read: ['view', 'modules'],
    view: {
        server: 'http://127.0.0.1:30099',
        templateDir: './',
    }
})

fms.view({
    title: '首页',
    url: '/index.php',
    template: '/view/index.html',
    data: {
        'content':'success',
    }
})