'use strict'
var path = require('path')
var extend = require('extend')

var config = {
    // 端口 http://127.0.0.1:3000/
    port: 3000,
    // 项目根目录配置
    root: process.cwd(),
    // 静态资源路径
    static: './',
    // 跨域开关
    CORS: false,
    // 读取HTML文件在 / 或 /fms/ 中 显示
    read: [],
    // express 中的 connect，如不熟悉请无视
    connect: function (req, res ,next) {
        next();
    },
    // 访问密码
    password: false,
    // URL替换
    urlRewrite: [

    ],
    // 静态资源替换
    staticReplace: function (req, data) {
        return data.replace(/<!--FMS([\S\s]*?)FMS-->/g,'$1')
    },
    // fms.ajax(settings) 默认配置
    ajax: {
        type: 'get',
        /*
        // 请求参数
        data: {
            id: 1
        }
        */
        res: {
            ok: {
                status: 'success'
            },
            err: {
                status: 'error',
                msg: 'Error detail'
            }
        },
        resStatus: {
            ok: 200,
            err: 200
        },
        timeout: 0,
        dataType: 'html'
    },
    view: {
        templateDir: './view/',
        templatePluginDir: './view/plugin/',
        type: 'get',
        data: {
            DEV: true
        },
        server: 'http://127.0.0.1:1234',
        filter: function (req, data) {
            /*
            不允许重写 data ：
            data = {}
            */
            // data.PAGE_URL = req.url;
            // data.PAGE_PATH = req.path;
            // data.METHOD = req.method;
            // data.GET = req.query;
            // data.POST = req.body;
        }
    }
}

config.ajax.docTemplate = function () {/*!
`AJAX` {{#if title}}{{title}}{{else}}{{url}}{{/if}}
---

- url: [{{url}}]({{url}})
- type: `{{type}}`

{{#if request}}
#### Request:
```js
{{{request}}}
```
{{/if}}
#### Response:
{{#each res}}
**{{@key}}:  **
```js
{{{this}}}
```
{{/each}}
        */}
config.view.docTemplate = function() {/*!
`View` {{#if title}}{{title}}{{else}}{{url}}{{/if}}
---------
- url: [{{url}}]({{url}})
- template: `{{template}}`
- type: `{{type}}`

{{#if request}}
#### Request:
```js
{{{request}}}
```
{{/if}}
#### Data:
{{#if data}}
```js
{{{data}}}
```
{{/if}}
        */}
module.exports.get = function () {
    return config
}
module.exports.set = function (newconfig) {
    config = newconfig
}