const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    image_path: {
        type: String
    }

}, {timestamps: true});

module.exports = model('Category', categorySchema);