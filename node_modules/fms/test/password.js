// var supertest = require('supertest')
// var $ = require('../index')
// var fs = require('fs')

// describe('password', function(){
//     describe('#need password', function(){
//         it('$.run(settings) settings.password not false should return password form', function(done){        
//             var sForm = fs.readFileSync(__dirname + '/../lib/handlebars/password-form.hbs').toString()
//             $.run({
//                 password: 'abc'
//             })
//             supertest($.app)
//                 .get('/test_password.js_1/')
//                 .expect(sForm)
//                 .expect(403)
//                 .end(function (err, body) {
//                     if (err) return done(err)
//                     supertest($.app)
//                         .post('/test_password.js_1/')
//                         .send({ password: '123'})
//                         .expect(403)
//                         .end(function (err, body) {
//                             if (err) return done(err)
//                             supertest($.app)
//                                 .post('/test_password.js_1/')
//                                 .send({ password: 'abc'})
//                                 .expect(301, done)
//                         })
//                 })
//         })
//     })
// })