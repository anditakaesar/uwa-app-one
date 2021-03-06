import mongoose from 'mongoose'
import moment from 'moment'

const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  imgurl: {
    type: [new Schema({
      public_id: String, url: String,
    }, { _id: false})],
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: 'uncategorized',
    trim: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  colors: {
    type: [new Schema({
      name: String, value: String,
    }, { _id: false})],
    default: [{ name: "default", value: "#ff00ff"}]
  },
  createdon: {
    type: Date,
    default: moment().valueOf(),
  },
  createdby: {
    type: String,
    default: null,
  },
  updatedon: {
    type: Date,
    default: null,
  },
  updatedby: {
    type: String,
    default: null,
  },
})

productSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  },
})

productSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id
  },
})

const Product = mongoose.model('Product', productSchema)

export default Product
