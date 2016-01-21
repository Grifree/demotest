var $ = require('../index')
var fs = require('fs')
var path = require('path')
var supertest = require('supertest')
require('should')

describe('#static-3', function() {
    it('should return this directory list', function() {
        $.run({
            root: __dirname + '/../'
        })
        console.log( __dirname + '/../')
        
        supertest($.app)
            .get('/test/')
            .end(function (err, res) {
                /static-3\.js/.test(res.text).should.eql(true)
            })
    })
})