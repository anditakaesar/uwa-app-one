import mongoose from 'mongoose';
import moment from 'moment';
const Schema = mongoose.Schema;

const mediaImageSchema = new Schema({
    public_id: {
        type: String,
        required: true,
        trim: true
    },
    filename: {
        type: String,
        required: true,
        trim: true
    },
    format: {
        type: String,
        required: true,
        trim: true
    },
    resource_type: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String]
    },
    uploaded_at: {
        type: Date,
        default: moment().valueOf()
    },
    secure_url: {
        type: String,
        required: true,
        trim: true
    },
    userid: {
        type: String,
        trim: true
    }
});

mediaImageSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        ret.thumb_url = _addTransform(ret.secure_url);
        delete ret._id;
        delete ret.__v;
    }
});

mediaImageSchema.set('toObject', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
    }
});

function _addTransform(secure_url) {
    let arr = secure_url.split('/'); 
    let i = arr.indexOf("upload") + 1;
    arr.splice(i, 0, "c_scale,w_300");
    return arr.join('/');
}

let MediaImage = mongoose.model('MediaImage', mediaImageSchema);

export default MediaImage;

