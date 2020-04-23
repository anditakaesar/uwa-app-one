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

describe('Color endpoint test', () => {
  let token
  let res
  let color = {
    id: '',
    name: 'Red',
    value: '#ff0000',
  }
  let user
  const appjson = 'application/json; charset=utf-8'
  const newcolor = {
    name: 'Blue Biru',
    value: '#0000ff',
  }
  const  editedcolor = {
    name: 'Red Merah',
    value: '#ff0000',
  }

  before((done) => {
    chai.request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        username: envtest.TEST_USERNAME,
        password: envtest.TEST_PASSWORD,
      })
      .end((err, response) => {
        res = response
        token = res.body.token
        user = res.body.user
        done()
      })
  })

  after((done) => {
    chai.request(app)
      .delete(`/color/${color.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send()
      .end((err, response) => {
        done()
      })
  })

  describe('POST /color', () => {
    describe('create color UNAUTHORIZED', () => {
      it('return body', (done) => {
        chai.request(app)
          .post('/color')
          .set('Content-Type', 'application/json')
          .send({
            name: newcolor.name,
            value: newcolor.value,
          })
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            color = res.body.color
            done()
          })
      })

      it('return 401 code', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(401)
        done()
      })
    })

    describe('create color AUTHORIZED', () => {
      it('return body', (done) => {
        chai.request(app)
          .post('/color')
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
          .send({
            name: newcolor.name,
            value: newcolor.value,
          })
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            color = res.body.color
            done()
          })
      })

      it('return 201 code', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(201)
        done()
      })

      it('return json content-type', (done) => {
        res.headers['content-type'].should.be.a('string')
        res.headers['content-type'].should.be.equal(appjson)
        done()
      })

      it('return same createby', (done) => {
        color.createdby.should.be.equal(user.id)
        done()
      })

      it('return same as posted', (done) => {
        color.name.should.be.equal(newcolor.name)
        color.value.should.be.equal(newcolor.value)
        done()
      })
    })
  })

  describe('GET /color', () => {
    describe('get all colors', () => {
      it('return body', (done) => {
        chai.request(app)
          .get('/color')
          .set('Content-Type', 'application/json')
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            done()
          })
      })

      it('return 200 code', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(200)
        done()
      })

      it('return json content-type', (done) => {
        res.headers['content-type'].should.be.a('string')
        res.headers['content-type'].should.be.equal(appjson)
        done()
      })

      it('contain colors body', (done) => {
        res.body.should.own.property('colors')
        res.body.colors.should.be.a('array')
        done()
      })
    })

    describe('get single color', () => {
      it('return body', (done) => {
        chai.request(app)
          .get(`/color/${color.id}`)
          .set('Content-Type', 'application/json')
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            done()
          })
      })

      it('return 200 code', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(200)
        done()
      })

      it('return json content-type', (done) => {
        res.headers['content-type'].should.be.a('string')
        res.headers['content-type'].should.be.equal(appjson)
        done()
      })

      it('contain color body', (done) => {
        res.body.should.own.property('color')
        res.body.color.should.be.a('object')
        done()
      })

      describe('color object properties', () => {
        it('contain id', (done) => {
          res.body.color.should.own.property('id')
          res.body.color.id.should.be.a('string')
          res.body.color.id.should.be.equal(color.id)
          done()
        })

        it('contain name', (done) => {
          res.body.color.should.own.property('name')
          res.body.color.name.should.be.a('string')
          res.body.color.name.should.be.equal(newcolor.name)
          done()
        })

        it('contain value', (done) => {
          res.body.color.should.own.property('value')
          res.body.color.value.should.be.a('string')
          res.body.color.value.should.be.equal(newcolor.value)
          done()
        })

        it('contain createdon createdby', (done) => {
          res.body.color.should.own.property('createdon')
          res.body.color.should.own.property('createdby')
          done()
        })

        it('contain updatedon updatedby', (done) => {
          res.body.color.should.own.property('updatedon')
          res.body.color.should.own.property('updatedby')
          done()
        })
      })
    })
  })

  describe('PUT /color', () => {
    describe('update single checklist', () => {
      it('should return body', (done) => {
        chai.request(app)
          .put(`/color/${color.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
          .send({
            name: editedcolor.name,
            value: editedcolor.value,
          })
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            done()
          })
      })

      it('return 200 code', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(200)
        done()
      })

      it('return json content-type', (done) => {
        res.headers['content-type'].should.be.a('string')
        res.headers['content-type'].should.be.equal(appjson)
        done()
      })

      it('contain message body', (done) => {
        res.body.should.own.property('message')
        res.body.message.should.be.a('string')
        done()
      })

      it('contain color body', (done) => {
        res.body.should.own.property('color')
        res.body.color.should.be.a('object')
        done()
      })

      describe('color object properties', () => {
        it('contain id', (done) => {
          res.body.color.should.own.property('id')
          res.body.color.id.should.be.a('string')
          res.body.color.id.should.be.equal(color.id)
          done()
        })

        it('contain name', (done) => {
          res.body.color.should.own.property('name')
          res.body.color.name.should.be.a('string')
          res.body.color.name.should.be.equal(editedcolor.name)
          done()
        })

        it('contain value', (done) => {
          res.body.color.should.own.property('value')
          res.body.color.value.should.be.a('string')
          res.body.color.value.should.be.equal(editedcolor.value)
          done()
        })

        it('contain createdon createdby', (done) => {
          res.body.color.should.own.property('createdon')
          res.body.color.should.own.property('createdby')
          done()
        })

        it('contain updatedon updatedby', (done) => {
          res.body.color.should.own.property('updatedon')
          res.body.color.should.own.property('updatedby')
          done()
        })
      })
    })
  })

  describe('DELETE /color', () => {
    
  })
})
