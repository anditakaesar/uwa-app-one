import { Router } from 'express'
import _ from 'lodash'
import fs from 'fs'
import { multerUploader, cloudinaryUploader } from './multerUploader'
import logger from '../logger'
import { env } from '../env'
import { genError } from '../utils'
import MediaImage from '../image/mediaImageModel'

const router = Router()

function processUpload(req, res, next) {
  process.nextTick(() => {
    const uploadedFile = req.file
    let serverAlbum = env.CLOUDINARY_ALBUM
    let tags = ['default']
    if (req.body.album) {
      serverAlbum = `${serverAlbum}/${req.body.album}`
    }

    if (req.body.tags) {
      tags = req.body.tags
    }

    // eslint-disable-next-line camelcase
    const public_id = `${serverAlbum}/${_.replace(uploadedFile.filename, /\.[^/.]+$/, '')}`

    cloudinaryUploader.upload(`${uploadedFile.path}`, { public_id, tags },
      (err, result) => {
        res.result = result
        if (err) {
          fs.unlink(uploadedFile.path, () => {})
          next(genError('Error uploading image', `Cloudinary Uploader error: ${err.message}`))
        } else {
          logger.info('Uploaded file to cloudinary', { public_id: result.public_id, secure_url: result.secure_url })
          fs.unlink(uploadedFile.path, (errx) => {
            if (errx) {
              logger.error('Error while deleting file', { intmsg: errx.message, filepath: uploadedFile.path })
            }

            next()
          })
        }
      })
  }) // nextTick()
}

router.post('/', multerUploader.single('file'),
  processUpload,
  (req, res, next) => {
    // contain res.result;
    const cloudinaryResult = res.result
    const newEntry = new MediaImage()
    newEntry.public_id = cloudinaryResult.public_id
    newEntry.filename = cloudinaryResult.original_filename
    newEntry.format = cloudinaryResult.format
    newEntry.resource_type = cloudinaryResult.resource_type
    newEntry.type = cloudinaryResult.type
    newEntry.tags = cloudinaryResult.tags
    newEntry.secure_url = cloudinaryResult.secure_url
    newEntry.userid = res.user ? res.user.id : null

    newEntry.save((err) => {
      if (err) {
        next(genError('Error while saving to library', err.message))
      } else {
        res.status(201).json({
          message: `File uploaded!, with name ${`${cloudinaryResult.original_filename}.${cloudinaryResult.format}`}`,
          url: cloudinaryResult.secure_url,
          mediaImage: newEntry,
        })
      }
    })
  }) // router.post

export default router
