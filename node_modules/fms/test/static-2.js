var $ = require('../index')
var fs = require('fs')
var path = require('path')
var supertest = require('supertest')
require('should')

describe('static-2', function() {
    it('should return this file contetn', function() {
        $.run({
            root: __dirname
        })
        var thisFileContent = fs.readFileSync(__dirname + path.join('/static-2.js')).toString()

        supertest($.app)
            .get('/static-2.js')
            .end(function (err, res) {
                res.text.should.eql(thisFileContent)
            })
    })
})