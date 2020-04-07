import { connect, connection } from 'mongoose'
import { env } from './env'
import logger from './logger'
import { genError } from './utils'

const FULLURI = `${env.MONGODB_URI}/${env.MONGODB_NAME}`
const mongoOpts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

export function createConnection() {
  return connect(FULLURI, mongoOpts,
    (err) => {
      if (err) {
        logger.error(err.message)
      } else {
        logger.info('database connected!')
      }
    })
}

export const checkDbReady = (req, res, next) => {
  if (connection.readyState) {
    next()
  } else {
    next(genError('Database not ready', `request: ${req.method} ${req.originalUrl}`))
  }
}

export const dbconn = connection

export default createConnection
