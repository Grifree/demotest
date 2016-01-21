var supertest = require('supertest')
var request = require('request')
require('should')
var $ = require('../index')
var iUtil = require('./util')

describe('fms.get', function(){

    $.run()
    $.get('/get/')
        .ok({GET:"ok"})
        .err({GET:"err"})

    $.post('/post/')
        .ok({POST:"ok"})
        .err({POST:"err"})

    $.put('/put/')
        .ok({PUT:"ok"})
        .err({PUT:"err"})

    $.delete('/delete/')
        .ok({DELETE:"ok"})
        .err({DELETE:"err"})
        
    var server = supertest($.app)

    it('GET should return "{"GET":"ok"}""', function(done){
        server
            .get('/get/')
            .expect('{"GET":"ok"}')
            .expect(200, done)
    })
    it('GET should return "{"GET":"err"}"', function(done){
        server
            .get('/get/')
            .set('Cookie', iUtil.res('/get/`ajax`get`err'))
            .expect('{"GET":"err"}')
            .expect(200, done)
    })

    it('POST should return "{"POST":"ok"}""', function(done){
        server
            .post('/post/')
            .expect('{"POST":"ok"}')
            .expect(200, done)
    })
    it('POST should return "{"POST":"err"}"', function(done){
        server
            .post('/post/')
            .set('Cookie', iUtil.res('/post/`ajax`post`err'))
            .expect('{"POST":"err"}')
            .expect(200, done)
    })

    it('PUT should return "{"PUT":"ok"}""', function(done){
        server
            .put('/put/')
            .expect('{"PUT":"ok"}')
            .expect(200, done)
    })
    it('PUT should return "{"PUT":"err"}"', function(done){
        server
            .put('/put/')
            .set('Cookie', iUtil.res('/put/`ajax`put`err'))
            .expect('{"PUT":"err"}')
            .expect(200, done)
    })

    it('DELETE should return "{"DELETE":"ok"}""', function(done){
        server
            .delete('/delete/')
            .expect('{"DELETE":"ok"}')
            .expect(200, done)
    })
    it('DELETE should return "{"PUT":"err"}"', function(done){
        server
            .delete('/delete/')
            .set('Cookie', iUtil.res('/delete/`ajax`delete`err'))
            .expect('{"DELETE":"err"}')
            .expect(200, done)
    })

})