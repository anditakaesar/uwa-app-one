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

describe('Checklist endpoint test', () => {
  let token
  let res
  let checklist
  let user
  const description = 'a new description for checklist'
  const editeddesc = 'an edited description'
  const appjson = 'application/json; charset=utf-8'

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
      .delete(`/checklist/${checklist.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send()
      .end((err, response) => {
        done()
      })
  })

  describe('POST /checklist', () => {
    describe('create checklist UNAUTHORIZED', () => {
      it('should return body', (done) => {
        chai.request(app)
          .post('/checklist')
          .set('Content-Type', 'application/json')
          .send({
            description: 'description',
          })
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            done()
          })
      })

      it('should return 401 code', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(401)
        done()
      })
    })

    describe('create checklist AUTHORIZED', () => {
      it('should return body', (done) => {
        chai.request(app)
          .post('/checklist')
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
          .send({
            description,
          })
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            checklist = res.body.checklist
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
    })
  })

  describe('GET /checklist', () => {
    describe('get all checklist', () => {
      it('return body', (done) => {
        chai.request(app)
          .get('/checklist')
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
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

      it('contain userid body', (done) => {
        res.body.should.own.property('userid')
        res.body.userid.should.be.a('string')
        res.body.userid.should.be.equal(user.id)
        done()
      })

      it('contain checklists body', (done) => {
        res.body.should.own.property('checklists')
        res.body.checklists.should.be.a('array')
        done()
      })
    })

    describe('get single checklist', () => {
      it('return body', (done) => {
        chai.request(app)
          .get(`/checklist/${checklist.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
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

      it('contain id body', (done) => {
        res.body.should.own.property('id')
        res.body.id.should.be.a('string')
        res.body.id.should.be.equal(checklist.id)
        done()
      })

      it('contain message body', (done) => {
        res.body.should.own.property('message')
        res.body.message.should.be.a('string')
        done()
      })

      it('contain checklist body', (done) => {
        res.body.should.own.property('checklist')
        res.body.checklist.should.be.a('object')
        done()
      })

      describe('checklist object properties', () => {
        it('contain id', (done) => {
          res.body.checklist.should.own.property('id')
          res.body.checklist.id.should.be.a('string')
          res.body.checklist.id.should.be.equal(checklist.id)
          done()
        })

        it('contain userid', (done) => {
          res.body.checklist.should.own.property('userid')
          res.body.checklist.userid.should.be.a('string')
          res.body.checklist.userid.should.be.equal(checklist.userid)
          done()
        })

        it('contain description', (done) => {
          res.body.checklist.should.own.property('description')
          res.body.checklist.description.should.be.a('string')
          res.body.checklist.description.should.be.equal(description)
          done()
        })

        it('contain checked as boolean', (done) => {
          res.body.checklist.should.own.property('checked')
          expect(res.body.checklist.checked).to.be.a('boolean')
          done()
        })

        it('contain createdOn createdBy', (done) => {
          res.body.checklist.should.own.property('createdOn')
          res.body.checklist.should.own.property('createdBy')
          done()
        })

        it('contain updatedOn updatedBy', (done) => {
          res.body.checklist.should.own.property('updatedOn')
          res.body.checklist.should.own.property('updatedBy')
          done()
        })
      })
    })
  })

  describe('PUT /checklist', () => {
    describe('update single checklist', () => {
      it('should return body', (done) => {
        chai.request(app)
          .put(`/checklist/${checklist.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
          .send({
            description: editeddesc,
            checked: true,
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

      it('contain id body', (done) => {
        res.body.should.own.property('id')
        res.body.id.should.be.a('string')
        res.body.id.should.be.equal(checklist.id)
        done()
      })

      it('contain message body', (done) => {
        res.body.should.own.property('message')
        res.body.message.should.be.a('string')
        done()
      })

      it('contain checklist body', (done) => {
        res.body.should.own.property('checklist')
        res.body.checklist.should.be.a('object')
        done()
      })

      describe('checklist object properties', () => {
        it('contain id', (done) => {
          res.body.checklist.should.own.property('id')
          res.body.checklist.id.should.be.a('string')
          res.body.checklist.id.should.be.equal(checklist.id)
          done()
        })

        it('contain userid', (done) => {
          res.body.checklist.should.own.property('userid')
          res.body.checklist.userid.should.be.a('string')
          res.body.checklist.userid.should.be.equal(checklist.userid)
          done()
        })

        it('contain description', (done) => {
          res.body.checklist.should.own.property('description')
          res.body.checklist.description.should.be.a('string')
          res.body.checklist.description.should.be.equal(editeddesc)
          done()
        })

        it('contain checked as boolean', (done) => {
          res.body.checklist.should.own.property('checked')
          expect(res.body.checklist.checked).to.be.a('boolean')
          done()
        })

        it('contain createdOn createdBy', (done) => {
          res.body.checklist.should.own.property('createdOn')
          res.body.checklist.should.own.property('createdBy')
          done()
        })

        it('contain updatedOn updatedBy', (done) => {
          res.body.checklist.should.own.property('updatedOn')
          res.body.checklist.should.own.property('updatedBy')
          done()
        })
      })
    })
  })

  describe('DELETE /checklist', () => {
    it('should delete the checklist', (done) => {
      chai.request(app)
        .delete(`/checklist/${checklist.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send()
        .end((err, response) => {
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

    it('contain id body', (done) => {
      res.body.should.own.property('id')
      res.body.id.should.be.a('string')
      res.body.id.should.be.equal(checklist.id)
      done()
    })

    it('contain message body', (done) => {
      res.body.should.own.property('message')
      res.body.message.should.be.a('string')
      done()
    })

    it('contain checklist body', (done) => {
      res.body.should.own.property('checklist')
      res.body.checklist.should.be.a('object')
      done()
    })

    describe('checklist object properties', () => {
      it('contain id', (done) => {
        res.body.checklist.should.own.property('id')
        res.body.checklist.id.should.be.a('string')
        res.body.checklist.id.should.be.equal(checklist.id)
        done()
      })

      it('contain userid', (done) => {
        res.body.checklist.should.own.property('userid')
        res.body.checklist.userid.should.be.a('string')
        res.body.checklist.userid.should.be.equal(checklist.userid)
        done()
      })

      it('contain description', (done) => {
        res.body.checklist.should.own.property('description')
        res.body.checklist.description.should.be.a('string')
        done()
      })

      it('contain checked as boolean', (done) => {
        res.body.checklist.should.own.property('checked')
        expect(res.body.checklist.checked).to.be.a('boolean')
        done()
      })

      it('contain createdOn createdBy', (done) => {
        res.body.checklist.should.own.property('createdOn')
        res.body.checklist.should.own.property('createdBy')
        done()
      })

      it('contain updatedOn updatedBy', (done) => {
        res.body.checklist.should.own.property('updatedOn')
        res.body.checklist.should.own.property('updatedBy')
        done()
      })
    })

    describe('check GET if still exist', () => {
      it('return body', (done) => {
        chai.request(app)
          .get(`/checklist/${checklist.id}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            done()
          })
      })

      it('return 404 code', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(404)
        done()
      })
    })
  })
})
