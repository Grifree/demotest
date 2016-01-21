var supertest = require('supertest')
var $ = require('../index')

describe('getHandle', function(){
    it('Request /fms/?type=handle should return handlers info ', function(done){        
        $.run()
        $.get({
            title: '测试',
            url: '/demo/'
        })
        supertest($.app)
            .get('/fms/?type=handle')
            .expect('{"/demo/":{"ajax":{"GET":{"title":"测试","res":["ok","err"]}}}}')
            .expect(200, done)
    })
})