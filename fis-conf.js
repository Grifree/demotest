fis.match('*.scss', {
    rExt: '.css',
    parser: fis.plugin('node-sass')
});

fis.match('*.handlebars', {
    rExt: '.js', // from .handlebars to .js 虽然源文件不需要编译，但是还是要转换为 .js 后缀
    parser: fis.plugin('handlebars-4.x'),
    release: false // handlebars 源文件不需要编译
});
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.scss', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('**.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

fis.match('**.md', {
    parser: fis.plugin('marked-template'),
    useCache: false,
    rExt: '.html'
})
fis.match('(**/)README.md', {
    release: '$1index.html',
})

var exclude = [
    'fis-conf.js',
    'fms.js',
    'fms*.js',
    'readme.*',
    '/output',
    /node_modules\//,
    /spm_modules\//,
    'package.json',
    'php/**.*'
    ]

exclude.forEach(function (value) {
    fis.match(value, {
        release: false
    })
})

fis.media('debug').match('**', {
    useHash: false,
    optimizer: false
})



// modules 的代码都是模块化代码，他们不会增加文件指纹
fis.match('/modules/**.{js,es6,jsx}', {
    isMod: true,
    useHash: false
})
fis.match('/view/**.{js,es6,jsx}', {
    // 资源入表 __COMMONJS_MAP__
    isJoinCommonjsMap: true
})

// 将 commonjs 转换为 AMD
fis.hook('commonjs');
fis.set('commonjsMap', {res:{}});

// 扫描模块化代码，根据扫描结果得到文件依赖
fis.match('::package', {
    packager: function (ret) {
        var commonjsMap = fis.get('commonjsMap')
        var id
        for (id in ret.ids) {
            var target = ret.ids[id]
            // 模块化文件
            if (target.isMod) {
                var info = {
                    url: target.map.uri,
                    type: target.map.type,
                    deps: []
                }
                // 存在依赖
                if (target.map.deps) {
                    // 添加依赖
                    var i
                    for (i = 0; i<target.map.deps.length; i++) {
                        target.map.deps[i] = target.map.deps[i].replace(/\.js$/i,'')
                    }
                    info.deps = target.map.deps
                }
                commonjsMap.res[target.moduleId] = info
                fis.set('commonjsMap', commonjsMap)
            }
            // 一些非模块化资源需要入表
            if (target.isJoinCommonjsMap) {
                commonjsMap.res[target.moduleId] = {
                    url: target.map.uri
                }
                fis.set('commonjsMap', commonjsMap)
            }
        }        
    },
    postpackager: function (ret) {
        var commonjsMap = fis.get('commonjsMap')
        var id
        for (id in ret.src) {
            var target = ret.src[id]
            // 将 __COMMONJS_MAP__ 替换为模块化资源表
            if (target._likes.isJsLike) {
                var content = target._content.replace(/__COMMONJS_MAP__/g, JSON.stringify(commonjsMap))
                target.setContent(content)
            }
        }    
    }
})