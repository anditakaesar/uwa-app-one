import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as CustomStrategy } from 'passport-custom'
import jwt from 'jsonwebtoken'
import { keys } from './signopt'
import logger from '../logger'
import User from '../user/userModel'
import env from '../env'

export const strategy = {
  LOCAL_LOGIN: 'local-login',
  LOCAL_SIGNUP: 'local-signup',
  JWT_LOGIN: 'jwt-login',
}

passport.serializeUser((user, next) => {
  next(null, user)
})

passport.deserializeUser((user, next) => {
  const newUser = {
    id: user._id,
    username: user.username,
    email: user.email,
    password: 'gotcha',
  }

  next(null, newUser)
})

const error = new Error('user not found or wrong password!')

// STRATEGIES
passport.use(strategy.LOCAL_LOGIN,
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, username, password, next) => {
      process.nextTick(() => {
        User.findOne({ username }, (err, user) => {
          if (err) {
            next(null, false, { message: err.message })
          }

          if (!user) {
            next(null, false, { message: error.message })
          } else { // user found
            // eslint-disable-next-line no-lonely-if
            if (user.active) { // check if user is active (not locked)
              if (user.validPassword(password)) { // success password
                user.lastLogin = Date.now()
                user.lastLoginTry = 0
                user.save()

                logger.info('success login', { intmsg: strategy.LOCAL_LOGIN, request: `${req.method} ${req.originalUrl}`, username: user.username })
                next(null, user)
              } else { // wrong password
                next(null, false, { message: error.message })
              }
            } else { // user is locked
              logger.error('locked user access attempt', { intmsg: strategy.LOCAL_LOGI, request: `${req.method} ${req.originalUrl}`, username: user.username })
              next(null, false, { message: error.message })
            }
          }
        })
      })
    },
  )) // local-login

passport.use(strategy.LOCAL_SIGNUP,
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, username, password, next) => {
      process.nextTick(() => {
        User.findOne({ username }, (err, user) => {
          if (err) {
            next(null, false, { message: err.message })
          }
          if (user) {
            next(null, false, { message: 'username already exists!' })
          } else {
            const newUser = new User()
            newUser.username = username
            newUser.email = req.body.email
            newUser.password = newUser.generateHash(password)
            newUser.save((errx) => {
              if (errx) {
                next(null, false, { message: errx.message })
              } else {
                logger.info('new user created!', { intmsg: strategy.LOCAL_SIGNUP, request: `${req.method} ${req.originalUrl}`, username: newUser.username })
                next(null, newUser)
              }
            })
          }
        })
      }) // nextTick
    },
  )) // local-signup

passport.use(strategy.JWT_LOGIN,
  new CustomStrategy(
    (req, next) => {
      process.nextTick(() => {
        jwt.verify(req.headers.authorization, keys.public, { algorithms: env.JWT_ALGORITHM },
          (err, decoded) => {
            if (err) {
              next(null, false, { message: err.message })
            } else {
              const user = {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email,
              }
              req.user = user
              next(null, user)
            }
          })
      })
    },
  ))

export default passport
