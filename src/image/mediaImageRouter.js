import { Router } from 'express'
import MediaImage, { addTransform } from './mediaImageModel'
import { genError } from '../utils'
import { cloudinaryApi } from '../uploader/multerUploader'
import { getAllProduct } from '../product/productRouter'

const router = Router()

function getAllMediaImage(req, res, next) {
  process.nextTick(() => {
    MediaImage.find({}, (err, mediaImages) => {
      if (err) {
        next(genError('Error retrieving ', err.message))
      }

      res.mediaImages = mediaImages
      next()
    })
  })
}

router.use((req, res, next) => {
  res.mediaImages = []
  res.products = []
  next()
})

router.get('/', getAllMediaImage, (req, res, next) => {
  res.status(200).json({
    mediaImages: res.mediaImages,
  })
}) // router.get

router.get('/orphan', getAllMediaImage, getAllProduct, (req, res) => {
  const thumb_urls = []
  res.mediaImages.forEach((m) => {
    thumb_urls.push({
      imgurl: addTransform(m.secure_url),
      public_id: m.public_id,
    })
  })

  const result = thumb_urls.filter((t) => {
    return !(res.products.filter((p) => { return p.imgurl === t.imgurl }).length > 0)
  })

  const public_ids = []
  result.forEach((r) => public_ids.push(r.public_id))

  res.status(200).json({
    message: 'orphan files',
    public_ids,
    result,
  })
})

router.get('/:id', (req, res, next) => {
  process.nextTick(() => {
    MediaImage.findById(req.params.id, (err, mediaImage) => {
      if (err) {
        next(genError('Error retrieving ', err.message))
      }

      res.status(200).json({
        id: req.params.id,
        mediaImage,
      })
    })
  })
}) // router.get(id)

router.delete('/', (req, res, next) => {
  if (!req.body.public_ids) {
    next(genError('require public_ids as array of public_id', req.body.public_ids))
  }

  process.nextTick(() => {
    cloudinaryApi.delete_resources(req.body.public_ids, (err) => {
      if (err) {
        next(genError('Error deletion on cloudinary', err.message))
      } else {
        req.body.public_ids.forEach((id) => {
          MediaImage.findOneAndDelete({ public_id: id }, (errx) => {
            if (errx) {
              next(genError(`Cannot remove media image with public_id: ${id}`, errx.message))
            }
          })
        })

        res.status(200).json({
          message: 'Image deleted',
          public_ids: req.body.public_ids,
        })
      }
    })
  })
}) // router.delete

export default router
