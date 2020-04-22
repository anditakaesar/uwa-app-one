import { Router } from 'express'
import moment from 'moment'
import Product from './productModel'
import { genError, isBodyValid } from '../utils'
import passport, { strategy } from '../auth/passport'

const router = Router()

router.post('/', passport.authenticate(strategy.JWT_LOGIN), (req, res, next) => {
  process.nextTick(() => {
    const newProduct = new Product()
    newProduct.name = req.body.name
    newProduct.imgurl = req.body.imgurl
    newProduct.description = req.body.description
    newProduct.price = req.body.price
    if (req.body.category) {
      newProduct.category = req.body.category
    } else {
      newProduct.category = 'uncategorized'
    }
    newProduct.stock = req.body.stock
    if (req.body.colors) {
      newProduct.colors = req.body.colors
    } else {
      newProduct.colors = [{
        name: 'default', value: '#ff00ee',
      }]
    }
    newProduct.createdby = req.user.id

    newProduct.save((err, createdProduct) => {
      if (err) {
        next(genError('cannot create new product', err.message))
      } else {
        res.status(201).json({
          message: 'new product created',
          product: createdProduct,
        })
      }
    })
  })
}) // router.post

router.get('/', (req, res, next) => {
  process.nextTick(() => {
    Product.find({}, (err, products) => {
      if (err) {
        next(genError('cannot retrieve all products', err.message, 404))
      } else {
        res.status(200).json({
          message: 'all products',
          products,
        })
      }
    })
  })
}) // router.get

router.get('/:id', (req, res, next) => {
  process.nextTick(() => {
    Product.findById(req.params.id, (err, product) => {
      if (err) {
        next(genError('cannot retrieve product', err.message))
      }

      if (!product) {
        next(genError('product not found', `product not found ${req.params.id}`, 404))
      } else {
        res.status(200).json({
          message: `product with id ${req.params.id}`,
          product,
        })
      }
    })
  })
}) // router.get id

router.put('/:id', passport.authenticate(strategy.JWT_LOGIN), (req, res, next) => {
  process.nextTick(() => {
    const {
      name, imgurl, description, price, category, stock, colors,
    } = req.body

    Product.findById(req.params.id, (err, product) => {
      if (err) {
        next(genError('cannot update product', err.message))
      }

      if (!product) {
        next(genError('product not found', `product with id ${req.params.id}`, 404))
      } else {
        product.name = isBodyValid(name) ? name : product.name
        product.imgurl = isBodyValid(imgurl) ? imgurl : product.imgurl
        product.description = isBodyValid(description) ? description : product.description
        product.price = isBodyValid(price) ? price : product.price
        product.category = isBodyValid(category) ? category : product.category
        product.stock = isBodyValid(stock) ? stock : product.stock
        product.colors = isBodyValid(colors) ? colors : product.colors
        product.updatedon = moment().valueOf()
        product.updatedby = req.user.id

        product.save((errx) => {
          if (errx) {
            next(genError('couldn\'t update product', errx.message))
          } else {
            res.status(200).json({
              message: `product '${product.name}' updated`,
              product,
            })
          }
        })
      }
    })
  })
}) // router.put id

router.delete('/:id', passport.authenticate(strategy.JWT_LOGIN), (req, res, next) => {
  process.nextTick(() => {
    Product.findOneAndDelete({ _id: req.params.id }, (err, product) => {
      if (err) {
        next(genError('cannot delete product', err.message))
      } else {
        res.status(200).json({
          message: `product '${product ? product.name : req.params.id}' deleted`,
          product,
        })
      }
    })
  })
}) // router.delete

export default router
