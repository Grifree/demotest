var supertest = require('supertest')
var request = require('request')
require('should')
var $ = require('../index')
var iUtil = require('./util')

describe('fms.get', function(){

    $.run({
        ajax: {
            res: {
                wait: {
                    wait: 'default'
                },
                stop: {
                    stop: 'default'
                }
            }
        }
    })
    $.get('/get/')
        .ok({GET:"ok"})
        .err({GET:"err"})
        .wait({wait:1})
        .stop({stop:1})

    $.post('/post/')
        .ok({POST:"ok"})
        .err({POST:"err"})
        .wait({wait:1})
        .stop({stop:1})

    $.put('/put/')
        .ok({PUT:"ok"})
        .err({PUT:"err"})
        .wait({wait:1})
        .stop({stop:1})

    $.delete('/delete/')
        .ok({DELETE:"ok"})
        .err({DELETE:"err"})
        .wait({wait:1})
        .stop({stop:1})

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

    // wait stop
    
    it('GET should return "{"wait":1}"', function(done){
        server
            .get('/get/')
            .set('Cookie', iUtil.res('/get/`ajax`get`wait'))
            .expect('{"wait":1}')
            .expect(200, done)
    })

    it('GET should return "{"stop":1}"', function(done){
        server
            .get('/get/')
            .set('Cookie', iUtil.res('/get/`ajax`get`stop'))
            .expect('{"stop":1}')
            .expect(200, done)
    })

    
    it('POST should return "{"wait":1}"', function(done){
        server
            .post('/post/')
            .set('Cookie', iUtil.res('/post/`ajax`post`wait'))
            .expect('{"wait":1}')
            .expect(200, done)
    })

    it('POST should return "{"stop":"err"}"', function(done){
        server
            .post('/post/')
            .set('Cookie', iUtil.res('/post/`ajax`post`stop'))
            .expect('{"stop":1}')
            .expect(200, done)
    })

    it('PUT should return "{"wait":1}""', function(done){
        server
            .put('/put/')
            .set('Cookie', iUtil.res('/put/`ajax`put`wait'))
            .expect('{"wait":1}')
            .expect(200, done)
    })

    it('PUT should return "{"stop":1}""', function(done){
        server
            .put('/put/')
            .set('Cookie', iUtil.res('/put/`ajax`put`stop'))
            .expect('{"stop":1}')
            .expect(200, done)
    })
    

    it('DELETE should return "{"wait":1}"', function(done){
        server
            .delete('/delete/')
            .set('Cookie', iUtil.res('/delete/`ajax`delete`wait'))
            .expect('{"wait":1}')
            .expect(200, done)
    })
    it('DELETE should return "{"stop":1}"', function(done){
        server
            .delete('/delete/')
            .set('Cookie', iUtil.res('/delete/`ajax`delete`stop'))
            .expect('{"stop":1}')
            .expect(200, done)
    })

})