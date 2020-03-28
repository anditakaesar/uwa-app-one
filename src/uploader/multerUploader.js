import multer from 'multer'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import moment from 'moment'
import cloudinary from 'cloudinary'
import logger from '../logger'
import { env } from '../env'

const uploadFolder = path.join(__dirname, env.UPLOAD_TEMP)

// initial create folder
if (!fs.existsSync(uploadFolder)) {
  fs.mkdir(uploadFolder, { recursive: true }, (err) => {
    if (err) {
      logger.error('check folder error', { intmsg: err.message })
    }
  })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder)
  },
  filename: (req, file, cb) => {
    const newName = `${moment().valueOf()}-${_.replace(file.originalname, /\s+/g, '_')}`
    cb(null, newName)
  },
})

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

const multerUpload = multer({ storage })
const cloudinaryUploader = cloudinary.v2.uploader
const cloudinaryApi = cloudinary.v2.api

export {
  multerUpload as multerUploader,
  cloudinaryUploader,
  cloudinaryApi,
}
