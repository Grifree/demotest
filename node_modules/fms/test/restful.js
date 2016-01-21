var $ = require('../index')
var fs = require('fs')
var path = require('path')
var supertest = require('supertest')
require('should')
var iUtil = require('./util')

describe('#RESTful', function() {
    $.run()
    $.ajax({
        type: 'get',
        url: '/user/:id',
        res: {
            ok: {
                status: "success",
                msg: "GET success"
            },
            err: "GET error"
        }
    })

    $.ajax({
        type: 'post',
        url: '/user/:id',
        res: {
            ok: {
                status: "success",
                msg: "POST success"
            },
            err: 'POST error'
        }
    })
    var server = supertest($.app)
    it('should return  GET success', function(done) {
            server
            .get('/user/1')
            .expect('{"status":"success","msg":"GET success"}')
            .expect(200, done)
    })
    it('should return  GET error', function(done) {
            server
            .get('/user/1')
            .set('Cookie', iUtil.res('/user/:id`ajax`get`err'))
            .expect('GET error')
            .expect(200, done)
    })
    it('should return  POST success', function(done) {
            server
            .post('/user/2')
            .expect('{"status":"success","msg":"POST success"}')
            .expect(200, done)
    })
    it('should return  POST error', function(done) {
            server
            .post('/user/2')
            .set('Cookie', iUtil.res('/user/:id`ajax`post`err'))
            .expect('POST error')
            .expect(200, done)
    })
})