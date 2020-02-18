const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let checklistSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    userid: {
        type: String,
        required: true,
        trim: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
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
});

// set
checklistSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

checklistSchema.set('toObject', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
    }
});

let Checklist = mongoose.model('Checklist', checklistSchema);

export default Checklist;