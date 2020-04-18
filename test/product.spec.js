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

describe('Product endpoint test', () => {
  let token
  let res
  let product
  let user
  const appjson = 'application/json; charset=utf-8'
  // const newproduct
  // const editedproduct

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

  // after((done) => {
  //   chai.request(app)
  //     .delete(`/product/${product.id}`)
  //     .set('Content-Type', 'application/json')
  //     .set('Authorization', token)
  //     .send()
  //     .end((err, response) => {
  //       done()
  //     })
  // })

  // CREATE
  // READ
  describe('GET /product', () => {
    describe('get all product', () => {
      it('return body', (done) => {
        chai.request(app)
          .get('/product')
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
    })
  }) // GET /product

}) // end product endpoint test
