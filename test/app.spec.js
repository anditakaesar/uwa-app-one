/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import 'dotenv/config'

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app'

// configure chai
chai.use(chaiHttp)
const should = chai.should()

describe('Main app tests', () => {
  let res

  describe('GET /', () => {
    it('return body object', (done) => {
      chai.request(app)
        .get('/')
        .end((err, response) => {
          res = response
          res.body.should.be.a('object')
          done()
        })
    })

    it('return 404 status code', (done) => {
      res.statusCode.should.be.a('number')
      res.statusCode.should.be.equal(404)
      done()
    })

    it('json content-type', (done) => {
      res.headers['content-type'].should.be.a('string')
      res.headers['content-type'].should.be.equal('application/json; charset=utf-8')
      done()
    })

    it('contain message body', (done) => {
      res.body.should.own.property('message')
      res.body.message.should.be.a('string')
      done()
    })
  })

  describe('Security settings', () => {
    it('set x-frame-options to SAMEORIGIN', (done) => {
      res.headers.should.own.property('x-frame-options')
      res.headers['x-frame-options'].should.be.a('string')
      res.headers['x-frame-options'].should.be.equal('SAMEORIGIN')
      done()
    })

    it('set x-xss-protection to mode 1; mode=block', (done) => {
      res.headers.should.own.property('x-xss-protection')
      res.headers['x-xss-protection'].should.be.a('string')
      res.headers['x-xss-protection'].should.be.equal('1; mode=block')
      done()
    })
  })
})
