import { Router } from 'express'
import jwt from 'jsonwebtoken'
import passport, { strategy } from './passport'
import { env } from '../env'
import { keys } from './signopt'
import { checkDbReady } from '../dbconn'
import { genError } from '../utils'

const router = Router()

function genToken(payload) {
  const signOptions = {
    expiresIn: env.JWT_EXPSEC,
    algorithm: env.JWT_ALGORITHM,
  }

  const token = jwt.sign(payload, keys.private, signOptions)
  return token
}

function genPayload(user) {
  const userPayload = {
    id: user._id,
    username: user.username,
    email: user.email,
  }

  return userPayload
}

// check db connection
router.use(checkDbReady)

router.post('/signup',
  passport.authenticate(strategy.JWT_LOGIN),
  (req, res, next) => {
    passport.authenticate(strategy.LOCAL_SIGNUP,
      (err, user, info) => { // user -> newUser created
        if (err) {
          next(genError('error while signing up', err.message))
        }

        if (!user) {
          next({ message: info.message })
        } else { // successful created, try-login
          req.logIn(user, (errx) => {
            if (errx) {
              next(genError('error while signing up', err.message))
            }

            const userPayload = genPayload(user)
            res.status(200).json({
              message: 'User success signup and loggedin',
              user: userPayload,
              token: genToken(userPayload),
            })
          })
        }
      })(req, res, next)
  })

router.post('/login', (req, res, next) => {
  passport.authenticate(strategy.LOCAL_LOGIN,
    (err, user, info) => { // user -> found user, correct password
      if (err) next(err)
      if (!user) {
        next({ message: info.message })
      } else { // user found
        req.login(user, (errx) => {
          if (errx) {
            next(genError('error logging in', err.message))
          }

          const userPayload = genPayload(user)
          res.status(200).json({
            message: 'User success login',
            user: userPayload,
            token: genToken(userPayload),
          })
        })
      }
    })(req, res, next)
})

router.get('/verify', passport.authenticate(strategy.JWT_LOGIN, {
  successRedirect: 'verify/success',
  failureRedirect: 'verify/fail',
}))

router.get('/verify/success', (req, res) => {
  res.status(200).json({
    message: 'token verified',
    verified: true,
  })
})

router.get('/verify/fail', (req, res) => {
  res.status(200).json({
    message: 'token expired',
    verified: false,
  })
})

export default router
