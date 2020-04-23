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
  let productid
  let user
  const appjson = 'application/json; charset=utf-8'
  const newproduct = {
    name: 'test product',
    imgurl: 'https://test.com/img.jpg',
    description: 'a test product',
    price: 100,
    category: 'test category',
    stock: 10,
    colors: [{ name: 'default', value: '#ff00ff'}],
  }
  const editedproduct = {
    name: 'edited product',
    imgurl: 'https://test.com/img.jpg',
    description: 'a test edited product',
    price: 100,
    category: 'test category',
    stock: 10,
    colors: [{ name: 'default', value: '#ff00ff'}],
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
      .delete(`/product/${productid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send()
      .end((err, response) => {
        done()
      })
  })

  // CREATE
  describe('POST /product', () => {
    describe('create product UNAUTHORIZED', () => {
      it('return body', (done) => {
        chai.request(app)
          .post('/product')
          .set('Content-Type', 'application/json')
          .send({})
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            product = res.body.product
            done()
          })
      })

      it('return 401 code', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(401)
        done()
      })
    }) // product UNAUTHORIZED

    describe('create product AUHTORIZED', () => {
      it('return body', (done) => {
        chai.request(app)
          .post('/product')
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
          .send(newproduct)
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            product = res.body.product
            productid = res.body.product.id
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
        product.createdby.should.be.equal(user.id)
        done()
      })

      it('return same as posted', (done) => {
        product.name.should.be.equal(newproduct.name)
        product.imgurl.should.be.equal(newproduct.imgurl)
        product.description.should.be.equal(newproduct.description)
        product.price.should.be.equal(newproduct.price)
        product.category.should.be.equal(newproduct.category)
        product.stock.should.be.equal(newproduct.stock)
        product.colors.should.be.a('array')
        product.colors[0].name.should.be.equal(newproduct.colors[0].name)
        product.colors[0].value.should.be.equal(newproduct.colors[0].value)
        done()
      })
    }) // create product authorized
  })
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
    }) // all product

    describe('get single product', () => {
      it('return body', (done) => {
        chai.request(app)
          .get(`/product/${productid}`)
          .set('Content-Type', 'application/json')
          .set('Authorization', token)
          .end((err, response) => {
            res = response
            res.body.should.be.a('object')
            product = res.body.product
            // no need to set id
            done()
          })
      })

      it('return correct response header', (done) => {
        res.statusCode.should.be.a('number')
        res.statusCode.should.be.equal(200)
        res.headers['content-type'].should.be.a('string')
        res.headers['content-type'].should.be.equal(appjson)
        done()
      })

      it('return correct response body', (done) => {
        product.id.should.be.equal(productid)
        product.name.should.be.equal(newproduct.name)
        product.imgurl.should.be.equal(newproduct.imgurl)
        product.description.should.be.equal(newproduct.description)
        product.price.should.be.equal(newproduct.price)
        product.category.should.be.equal(newproduct.category)
        product.stock.should.be.equal(newproduct.stock)
        product.colors.should.be.a('array')
        product.colors[0].name.should.be.equal(newproduct.colors[0].name)
        product.colors[0].value.should.be.equal(newproduct.colors[0].value)
        done()
      })
    }) // single product

  }) // GET /product

  // UPDATE
  // describe('PUT /product', () => {
    
  // })

}) // end product endpoint test
