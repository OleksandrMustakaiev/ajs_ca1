const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    image_path: {
        type: String
    },
    // many to many (Tracks)
    tracks: [{
        type: Schema.Types.ObjectId, 
        ref: 'Track' 
    }]

}, {timestamps: true});

module.exports = model('Category', categorySchema);