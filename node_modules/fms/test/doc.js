var supertest = require('supertest')
var request = require('request')
require('should')
var $ = require('../index')

describe('doc', function(){
    $.run()
    $.get('/some/',{
        res:{
            ok: {
                msg: 'oktestgetsomedoc'
            }
        }
    })
    it('doc should has "{"msg":"oktestgetsomedoc"}""', function (done) {
        setTimeout(function () {
            var createDoc =  require('../lib/doc').getDoc()            
            var find = createDoc.indexOf('oktestgetsomedoc') !== -1 ? true: false
            if (find) {
                done()
            }
        }, 0)
    })
})