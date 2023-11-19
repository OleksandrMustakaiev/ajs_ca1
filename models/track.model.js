const { Schema, model } = require('mongoose');

const trackSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title field is required']
    },
    lyrics: {
        type: String,
        required: [true, 'Lyrics field is required']
    },
    image_path: {
        type: String
    },
    // one to many
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User ID is require'],
        ref: 'User'
    },
    // many to many (Author)
    authors: [{
        type: Schema.Types.ObjectId, 
        ref: 'Author' 
    }]

}, {timestamps: true});

module.exports = model('Track', trackSchema);