import { Router } from 'express';
import Product from './productModel';
import { genError, isBodyValid } from '../utils';
import moment from 'moment';

const router = Router();

router.post('/', (req, res, next) => {
    process.nextTick(() => {
        let newProduct = new Product();
        newProduct.name = req.body.name;
        newProduct.imgurl = req.body.imgurl;
        newProduct.description = req.body.description;
        newProduct.price = req.body.price;
        newProduct.category = req.body.category;
        newProduct.stock = req.body.stock;
        newProduct.colors = req.body.colors;
        newProduct.createdby = req.user.id;

        newProduct.save((err) => {
            if (err) {
                next(genError(`cannot create new product`, err.message));
            } else {
                res.status(201).json({
                    message: `new product created`,
                    product: newProduct
                });
            }
        });
    });
}); // router.post

router.get('/', (req, res, next) => {
    process.nextTick(() => {
        Product.find({}, (err, products) => {
            if (err) {
                next(genError(`cannot retrieve all products`, err.message, 404));
            } else {
                res.status(200).json({
                    message: `all products`,
                    products: products
                });
            }
        });
    });
}); // router.get

router.get('/:id', (req, res, next) => {
    process.nextTick(() => {
        Product.findById(req.params.id, (err, product) => {
            if (err) {
                next(genError(`cannot retrieve product`, err.message));
            } 
            
            if (!product) {
                next(genError(`product not found`, `product not found ${req.params.id}`, 404));
            } else {
                res.status(200).json({
                    message: `product with id ${req.params.id}`,
                    product: product
                });
            }
        });
    });
}); // router.get id

router.put('/:id', (req, res, next) => {
    process.nextTick(() => {
        Product.findById(req.params.id, (err, product) => {
            if (err) {
                next(genError(`cannot update product`, err.message));
            }

            if (!product) {
                next(genError(`product not found`, `product with id ${req.params.id}`, 404));
            } else {
                product.name = isBodyValid(req.body.name) ? req.body.name : product.name;
                product.imgurl = isBodyValid(req.body.imgurl) ? req.body.imgurl : product.imgurl;
                product.description = isBodyValid(req.body.description) ? req.body.description : product.description;
                product.price = isBodyValid(req.body.price) ? req.body.price : product.price;
                product.category = isBodyValid(req.body.category) ? req.body.category : product.category;
                product.stock = isBodyValid(req.body.stock) ? req.body.stock : product.stock;
                product.colors = isBodyValid(req.body.colors) ? req.body.colors : product.colors;
                product.updatedon = moment().valueOf();
                product.updatedby = req.user.id;

                product.save((err) => {
                    if (err) {
                        next(genError(`couldn't update product`, err.message));
                    } else {
                        res.status(200).json({
                            message: `product '${product.name}' updated`,
                            product: product
                        });
                    }
                });
            }
        });
    });
}); // router.put id

router.delete('/:id', (req, res, next) => {
    process.nextTick(() => {
        Product.findOneAndDelete({ _id: req.params.id}, (err, product) => {
            if (err) {
                next(genError(`cannot delete product`, err.message));
            } else {
                res.status(200).json({
                    message: `product '${product ? product.name : req.params.id}' deleted`,
                    product: product
                });
            }
        });
    });
}); // router.delete

export default router;