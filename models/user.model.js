const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    full_name: {
        type: String,
        trim: true,
        required: [true, 'Full Name field is required!']
    },
    email: {
        type: String,
        trim: true,
        unique: [true, 'Email already exists'], // to make sure no one will create a same account with same email
        required: [true, 'Email field is required!'],
        lowercase: true // only lowercase characters
    },
    password: {
        type: String,
        required: [true, 'Password field is required!'],
        min: 6 // minimum 6 characters for password
    },
    admin: {
        type: Boolean,
        required: [true, 'Role field is required!']
    },
    // tracks: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Track'
    // }]

}, {timestamps: true});


userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = model('User', userSchema);