import { Router } from 'express'
import moment from 'moment'
import Color from './colorModel'
import { genError, isBodyValid } from '../utils'
import passport, { strategy }  from '../auth/passport'

const router = Router()

router.post('/', passport.authenticate(strategy.JWT_LOGIN), (req, res, next) => {
  process.nextTick(() => {
    const newColor = new Color()
    newColor.name = req.body.name
    newColor.value = req.body.value
    newColor.createdby = req.user.id

    newColor.save((err) => {
      if (err) {
        next(genError('cannot create new color', err.message))
      } else {
        res.status(201).json({
          message: 'new color created',
          color: newColor,
        })
      }
    })
  })
}) // router.post

router.get('/', (req, res, next) => {
  process.nextTick(() => {
    Color.find({}, (err, colors) => {
      if (err) {
        next(genError('cannot retrieve all colors', err.message))
      } else {
        res.status(200).json({
          message: 'retrieve all colors',
          colors,
        })
      }
    })
  })
}) // router.get

router.get('/:id', (req, res, next) => {
  process.nextTick(() => {
    Color.findById(req.params.id, (err, color) => {
      if (err) {
        next(genError('cannot retrieve all colors', err.message))
      } else if (!color) {
        res.status(404).json({
          message: 'color not found',
          color: '',
        })
      } else {
        res.status(200).json({
          message: 'retrieving color detail',
          color,
        })
      }
    })
  })
}) // router.get/:id

router.put('/:id', passport.authenticate(strategy.JWT_LOGIN), (req, res, next) => {
  process.nextTick(() => {
    Color.findById(req.params.id, (err, color) => {
      if (err) {
        next(genError('cannot update color', err.message))
      }

      if (!color) {
        res.status(404).json({
          message: 'color not found',
        })
      } else {
        color.name = isBodyValid(req.body.name) ? req.body.name : color.name
        color.value = isBodyValid(req.body.value) ? req.body.value : color.value
        color.updatedby = req.user.id
        color.updatedon = moment().valueOf()

        color.save((errx) => {
          if (errx) next(genError('couldn\'t update color', errx.message))
          res.status(200).json({
            message: `color '${color.name}' updated`,
            color,
          })
        })
      }
    })
  })
}) // router.put

router.delete('/:id', passport.authenticate(strategy.JWT_LOGIN), (req, res, next) => {
  process.nextTick(() => {
    Color.findOneAndDelete({ _id: req.params.id }, (err, color) => {
      if (err) {
        next(genError('cannot delete color', err.message))
      } else {
        res.status(200).json({
          message: `color '${color.name}' deleted`,
          color,
        })
      }
    })
  })
}) // router.get

export default router
