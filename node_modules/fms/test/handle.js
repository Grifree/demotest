var supertest = require('supertest')
var request = require('request')
require('should')
var $ = require('../index')

describe('handle', function(){
  describe('#handle url is exist', function(){
    $.run()
    var handle = require('../lib/controller').handle
    it('handle /demo/ GET should return "url is exist!"', function(){
        handle('/demo/', 'ajax', {type: 'GET'} , function (req, res) {

        })
        try {
            handle('/demo/', 'ajax', {type: 'GET'} , function (req, res) {
                
            })
        }
        catch (err){            
            err.toString().should.eql('url is exist!')
        }
    })
    it('handle /demo/  ajax POST should return "url is exist!"', function(){
        handle('/demo/', 'ajax',{type: 'POST'} , function (req, res) {

        })
        try {
            handle('/demo/', 'ajax', {type: 'POST'} , function (req, res) {
                
            })
        }
        catch (err){            
            err.toString().should.eql('url is exist!')
        }
    })
    it('handle /demo/ view POST should return "url is exist!"', function(){
        handle('/demo/', 'view', {type: 'POST'} , function (req, res) {

        })
        try {
            handle('/demo/', 'view', {type: 'POST'} , function (req, res) {
                
            })
        }
        catch (err){            
            err.toString().should.eql('url is exist!')
        }
    })
  })
})