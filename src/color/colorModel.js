import mongoose from 'mongoose';
import moment from 'moment';
const Schema = mongoose.Schema;

const colorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    value: {
        type: String,
        required: true,
        trim: true,
    },
    createdon: {
        type: Date,
        default: moment().valueOf()
    },
    createdby: {
        type: String,
        default: null
    },
    updatedon: {
        type: Date,
        default: null
    },
    updatedby: {
        type: String,
        default: null
    }
});

colorSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

colorSchema.set('toObject', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
    }
});

let Color = mongoose.model('Color', colorSchema);

export default Color;