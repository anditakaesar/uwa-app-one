const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');

let userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: null
    },
    createdBy: {
        type: String,
        default: null
    },
    updatedOn: {
        type: Date,
        default: null
    },
    updatedBy: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin', 'superadmin']
    },
    lastLogin: {
        type: Date,
        default: null
    },
    lastLoginIP: {
        type: [String]
    },
    lastLoginTry: {
        type: Number,
        default: 0
    }
});

// schema methods
userSchema.methods.generateHash = function (password) {
    return bcryptjs.hashSync(password, 8);
};

userSchema.methods.validPassword = function (password) {
    return bcryptjs.compareSync(password, this.password);
};

let User = mongoose.model('User', userSchema);

export default User;