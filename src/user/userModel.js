import mongoose from 'mongoose'
import moment from 'moment'

const { Schema } = mongoose
const bcryptjs = require('bcryptjs')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: moment().valueOf(),
  },
  createdBy: {
    type: String,
    default: null,
  },
  updatedOn: {
    type: Date,
    default: null,
  },
  updatedBy: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin'],
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  lastLoginIP: {
    type: [String],
  },
  lastLoginTry: {
    type: Number,
    default: 0,
  },
})

function generateHash(password) {
  return bcryptjs.hashSync(password, 8)
}

function validPassword(password) {
  return bcryptjs.compareSync(password, this.password)
}

// schema methods
userSchema.methods.generateHash = generateHash
userSchema.methods.validPassword = validPassword

const User = mongoose.model('User', userSchema)

export default User
