# FMS 
> Front Mock Server | 前端数据模拟服务器

[![Build Status](https://api.travis-ci.org/nimojs/fms.svg)](https://travis-ci.org/nimojs/fms)
[![NPM version](https://img.shields.io/npm/v/fms.svg?style=flat)](https://npmjs.org/package/fms)
[![NPM downloads](http://img.shields.io/npm/dm/fms.svg?style=flat)](https://npmjs.org/package/fms)


<a href="http://fmsjs.org/" target="_blank" class="btn btn-info">在线文档</a>
<a href="http://demo.fmsjs.org/" target="_blank" class="btn btn-danger">在线示例</a>

## FMS 提供了一套解决方案
前端基于 FMS 可以独立完成Web数据模拟(AJAX、后端模板引擎渲染页面)。

> 基于 Node 的前后端分离成本太高，不适合小型团队。而 Mock Server 的前后端分离解决方案不需要改动后端框架，且上手简单会 AJAX 就会使用 FMS。

## 功能
- 模拟 AJAX
- 模拟后端模板引擎渲染
- 根据模拟代码生成文档

## 亮点
### JS语法配置模拟代码
```js
fms.ajax({
    type: 'get',
    url: '/demo/',
    res: {
        ok: 1,
        error: 0
    }
})
```

http://demo.fmsjs.org/demo/

### 自动生成数据文档
<table>
    <tr>
        <td>
            <pre>
fms.ajax({
    type: 'get',    
    title: '获取用户名',
    url: '/get_user/',
    request: {
        id: '2',
        _id: "用户ID"
    },
    res: {
        ok: {
            status: "success",
            username: "fms"
        },
        err: {
            status: "error",
            msg: "请先登录"
        }
    }
})
            </pre>
        </td>
        <td>
            <img src="http://fmsjs.org/static/img/readme-1.png"  />
        </td>
    </tr>
</table>


### 模拟任何后端模板引擎渲染
- [PHP Echo](https://github.com/nimojs/fms-phpecho)
- [PHP Smarty](https://github.com/nimojs/fms-smarty)


下一篇：[前端数据模拟痛点](http://fmsjs.org/why-use-fms.html)
