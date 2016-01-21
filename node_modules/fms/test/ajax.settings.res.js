var supertest = require('supertest')
var request = require('request')
require('should')
var $ = require('../index')

describe('ajax.settings.res', function(){
    it('/AEFBDF22-38DD-BF37-60F6-1348A8FBA5C6/ GET should return "{data:1}"', function(done){
        $.run()
        $.ajax({
            type: 'get',
            url:'/AEFBDF22-38DD-BF37-60F6-1348A8FBA5C6/',
            res: {
                ok: {
                    data: 1
                },
                err: false
            }
        })
        supertest($.app)
            .get('/AEFBDF22-38DD-BF37-60F6-1348A8FBA5C6/')
            .expect('{"data":1}')
            .expect(200, done)
    })
    it('/2A161667-5C6E-9EE6-C49C-BC7E16E88839/ GET should return "{data:1}"', function(done){
        $.run()
        $.ajax({
            type: 'get',
            url:'/2A161667-5C6E-9EE6-C49C-BC7E16E88839/'
        })
        supertest($.app)
            .get('/2A161667-5C6E-9EE6-C49C-BC7E16E88839/')
            .expect('{"status":"success"}')
            .expect(200, done)
    })
})