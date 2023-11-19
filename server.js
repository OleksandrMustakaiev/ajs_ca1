const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
// const port = process.env.PORT || 3000;

// Import dotenv - to make .env work
require('dotenv').config();
// Import DB - "init" function
require('./configs/db.js')();

// Tell express to make respond as json file not text/html
app.use(express.json());
// Settings for express
app.set('view engine', 'html');
// Will serve any files (html, images and so on) inside "views" folder
app.use(express.static(__dirname + '/views/'));
// Upload images to public folder
app.use(express.static(__dirname + '/public/'));

// Custom middleware
app.use((req, res, next) => {

    console.log(req.headers);
    let token = null;

    if(req.headers.authorization){
        token = req.headers.authorization.split(' ');
    }
    console.log(token);

    if(token && token[0] === 'Bearer'){
        // verify token is valid
        jwt.verify(token[1], process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                req.user = undefined;
            }

            req.user = decoded;
            // next();
        });
    } else {
        console.log('No Token');
        req.user = undefined;
    }

    next();
});

app.use((req, res, next) => {
    console.log(req.user);
    next();
});

// Calling Users API from routes/users.js
app.use('/api/users', require('./routes/users'));
// Calling Tracks API from routes/tracks.js
app.use('/api/tracks', require('./routes/tracks'));
// Calling Authors API from routes/authors.js
app.use('/api/authors', require('./routes/authors'));
// Calling Categories API from routes/categories.js
app.use('/api/categories', require('./routes/categories'));


if (req.path === "/favicon.ico") {
    // Skip token verification for favicon requests
    return next();
  }

// To run localhost
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});