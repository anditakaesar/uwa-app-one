import 'dotenv/config'

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app'

// configure chai
chai.use(chaiHttp)
let should = chai.should()

describe('Main app tests', () => {
  describe('GET /', () => {
    it('it should GET nothing', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.body.should.be.a('object')
          done()
        })
    })
  })
})