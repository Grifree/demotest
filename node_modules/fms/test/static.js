var $ = require('../index')
var fs = require('fs')
var path = require('path')
var supertest = require('supertest')
require('should')

describe('#static', function() {
    describe('#run(settings.static)', function() {
        it('config.static should return root + "./"', function() {
            $.run()
            require('../lib/config').get().static.should.eql(process.cwd() + path.join('/') + path.join('./'))
        })
        it('config.static should return root + ".\\"', function() {
            $.run({
                static: "../"
            })
            require('../lib/config').get().static.should.eql(process.cwd() + path.join('/') + path.join('../'))
        })
    })
})