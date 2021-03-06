import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import session from 'express-session'
import logger from './logger'
import { createConnection, dbconn } from './dbconn'
import { env } from './env'
import passport, { strategy } from './auth/passport'

const app = express()

// dbconn
createConnection()

// middlewares
app.use(json())
app.use(compression())
app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(helmet())

// session
const MongoStore = require('connect-mongo')(session)

app.use(session({
  name: env.SESSION_NAME,
  secret: env.COOKIES_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: env.COOKIES_AGESEC * 1000, secure: env.COOKIES_SECURE },
  store: new MongoStore({ mongooseConnection: dbconn }),
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// router
app.use('/checklist', passport.authenticate(strategy.JWT_LOGIN), require('./checklist/checklistRouter').default)
app.use('/auth', require('./auth/authRouter').default)
app.use('/upload', passport.authenticate(strategy.JWT_LOGIN), require('./uploader/uploadRouter').default)
app.use('/mediaimage', passport.authenticate(strategy.JWT_LOGIN), require('./image/mediaImageRouter').default)
app.use('/color', require('./color/colorRouter').default)
app.use('/product', require('./product/productRouter').default)

// end point for error handling
app.use((err, req, res, next) => {
  if (err) {
    if (!err.status) err.status = 500

    logger.error(err.message, {
      request: `${req.method} ${req.originalUrl}`,
      intmsg: err.intmsg,
    })

    res.status(err.status).json({
      message: err.message,
    })
  } else {
    next()
  }
})

// 404 endpoint
app.use((req, res) => {
  let username = 'anonymous'
  if (req.user) {
    username = req.user.username
  }
  logger.warn('request made', {
    user: username,
    ip: req.ip,
    url: req.originalUrl,
  })
  res.status(404).json({
    message: 'resource not found',
  })
})

export default app
