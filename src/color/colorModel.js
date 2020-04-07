import mongoose from 'mongoose'
import moment from 'moment'

const { Schema } = mongoose

const colorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
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

colorSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  },
})

colorSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id
  },
})

const Color = mongoose.model('Color', colorSchema)

export default Color
