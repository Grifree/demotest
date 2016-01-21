var supertest = require('supertest')
var request = require('request')
var $ = require('../index')


describe('cookies-fms', function(){
    describe('#cookies default req.cookies.fms', function(){
        it('should renturn "{}"', function(){
            // 使用 portfinder 的原因是担心某些端口被访问过已经存在 cookie
                $.run()
                $.app.get('/test_cookie-fms.js_1/', function (req, res) {
                    res.json(req.cookies.fms)
                })
                supertest($.app)
                .get('/test_cookie-fms.js_1/')
                .end(function (err, res) {
                    res.body.should.eql('{}')
                })
        })
    })
})