var supertest = require('supertest')
var request = require('request')
var $ = require('../index')

describe('port', function(){
  describe('#run(port)', function(){
    it('should return ok', function(done){
        $.run()
        $.app.get('/test_port.js_1/', function (req, res) {
            res.send('ok')
        })
        supertest($.app)
        .get('/test_port.js_1/')
        .expect('ok')
        .expect(200, done);
    })
  })
})