var $ = require('../index')
var fs = require('fs')
var path = require('path')
var supertest = require('supertest')
require('should')
var iUtil = require('./util')

describe('#ajax', function() {
    $.run()
    $.ajax({
        type: 'get',
        url: '/user/',
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
        url: '/user/',
        res: {
            ok: {
                status: "success",
                msg: "POST success"
            },
            err: 'POST error'
        }
    })
    $.ajax('/url-settings/', {
        type: 'get',
        res: {
            ok :1,
            err :2
        }
    })

    var server = supertest($.app)
    it('should return  GET success', function(done) {
            server
            .get('/user/')
            .expect('{"status":"success","msg":"GET success"}')
            .expect(200, done)
    })
    it('should return  GET error', function(done) {
            server
            .get('/user/')
            .set('Cookie', iUtil.res('/user/`ajax`get`err'))
            .expect('GET error')
            .expect(200, done)
    })
    it('should return  POST success', function(done) {
            server
            .post('/user/')
            .expect('{"status":"success","msg":"POST success"}')
            .expect(200, done)
    })
    it('should return  POST error', function(done) {
            server
            .post('/user/')
            .set('Cookie', iUtil.res('/user/`ajax`post`err'))
            .expect('POST error')
            .expect(200, done)
    })
    it('/url-settings/ should return  1', function(done) {
            server
            .get('/url-settings/')
            .expect('1')
            .expect(200, done)
    })
    it('/url-settings/ should return  2', function(done) {
            server
            .get('/url-settings/')
            .set('Cookie', iUtil.res('/url-settings/`ajax`get`err'))
            .expect('2')
            .expect(200, done)
    })
})