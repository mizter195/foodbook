const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const Message = require('../models/Message');

exports.ensure_authorization = function (req, res, next) {
    let bearerHeader = req.header("authorization");
    if (typeof bearerHeader !== 'undefined') {
        jwt.verify(bearerHeader, config.secret, function (err, decoded) {
            if (err) {
                res.json(new Message(403, "Failed to authenticate token!"));
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json(new Message(403, "Invalid token"));
    }
};

exports.session_authorization = function (req, res, next) {
    let user = req.cookies.user;
    if (typeof user !== 'undefined') {
        next();
    } else {
        res.render('home',{cookie:null});
    }
};