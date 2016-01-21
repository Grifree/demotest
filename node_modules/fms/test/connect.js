var supertest = require('supertest')
var $ = require('../index')

describe('connect', function(){
    it('connect /test_connect.js_1/ should return "connect ok , /test_connect.js_2/ statusCode is 404"', function(done){        
        $.run({
            connect: function (req, res, next) {
                if (req.url === '/test_connect.js_1/') {
                    res.send('connect ok')
                }
                else {
                    // res.send('connect ok')
                    next()
                }
            }
        })            
        supertest($.app)
            .get('/test_connect.js_1/')
            .expect('connect ok')
            .expect(200)
            .end(function (err) {
                if (err) return done(err)
                supertest($.app)
                    .get('/test_connect.js_2/')
                    .expect(404, done)
            })
    })
})