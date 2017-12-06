const express = require('express');
const router = express.Router();
const rateController = require('../controller/RateController');
const Message = require('../models/Message');
const async = require('async');
const jwt = require('jsonwebtoken');
const authorization = require('../controller/Authorization');

//POST rate a review
router.post('/ratereview', authorization.ensure_authorization, function (req, res) {
    let user = req.decoded;
    let rate = req.body;
    rate.user_id = user.id;
    rateController.rate(rate, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET rate by review_id
router.get('/get', function (req, res) {
    let review_id = req.query.review_id;
    rateController.getRateScore(review_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err))
    })
});

//GET rate of user
router.get('/getrate', function (req, res) {
    let review_id = req.query.review_id;
    let user_id = req.query.user_id;
    rateController.getRateOfUser(user_id, review_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

module.exports = router;