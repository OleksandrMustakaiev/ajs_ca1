// Import Model
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const register = (req, res) => {

    let newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser.admin = false;

    newUser.save()
        .then(user => {
            user.password = undefined;
            return res.status(201).json({
                data: user
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({
                msg: err
            });
        });
};

const login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // check if password match
            if(!user || !user.comparePassword(req.body.password)){
                return res.status(401).json({ msg: 'Authentication failed. Invalid user or password.' });
            } 

            let token = jwt.sign({
                email: user.email,
                full_name: user.full_name,
                _id: user._id,
                role: user.role
            }, process.env.JWT_SECRET);

            return res.status(200).json({token});
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({
                msg: err
            });
        });
};

const loginRequired = (req, res, next) => {
    if(req.user){
        next();
    } else {
        return res.status(401).json({ msg: 'Unauthorised user!' });
    }
};

const profile = (req, res) => {

};


module.exports = {
    register,
    login,
    profile,
    loginRequired
}