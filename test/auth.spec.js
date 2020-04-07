/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import 'dotenv/config'

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app'
import { envtest } from '../src/env-test'
import 'chai/register-expect'
import 'chai/register-should'

// configure chai
chai.use(chaiHttp)

describe('Authentication User app tests', () => {
  let res

  describe('POST /auth/login FAIL tests', () => {
    it('return body', (done) => {
      chai.request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          username: 'test',
          password: 'test',
        })
        .end((err, response) => {
          res = response
          res.body.should.be.a('object')
          done()
        })
    })

    it('return 500 status code', (done) => {
      res.statusCode.should.be.a('number')
      res.statusCode.should.be.equal(500)
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

  describe('POST /auth/login SUCCESS tests', () => {
    it('return body', (done) => {
      chai.request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          username: envtest.TEST_USERNAME,
          password: envtest.TEST_PASSWORD,
        })
        .end((err, response) => {
          res = response
          // console.log(response.body)
          // console.log(response.headers)
          // console.log('status code', response.statusCode)
          res.body.should.be.a('object')
          done()
        })
    })

    it('return 200 status code', (done) => {
      res.statusCode.should.be.a('number')
      res.statusCode.should.be.equal(200)
      done()
    })

    it('return json content-type', (done) => {
      res.headers['content-type'].should.be.a('string')
      res.headers['content-type'].should.be.equal('application/json; charset=utf-8')
      done()
    })

    it('contain message body', (done) => {
      res.body.should.own.property('message')
      res.body.message.should.be.a('string')
      done()
    })

    it('contain user object', (done) => {
      res.body.should.own.property('user')
      res.body.user.should.be.a('object')
      done()
    })

    it('contain token string', (done) => {
      res.body.should.own.property('token')
      res.body.token.should.be.a('string')
      done()
    })

    describe('User object properties', () => {
      it('contain id', (done) => {
        res.body.user.should.own.property('id')
        res.body.user.id.should.be.a('string')
        done()
      })

      it('contain username', (done) => {
        res.body.user.should.own.property('username')
        res.body.user.username.should.be.a('string')
        done()
      })

      it('contain email', (done) => {
        res.body.user.should.own.property('email')
        res.body.user.email.should.be.a('string')
        done()
      })

      it('not contain password', (done) => {
        res.body.user.should.not.own.property('password')
        res.body.user.should.not.own.property('pass')
        res.body.user.should.not.own.property('passwd')
        done()
      })
    })
  })
})
