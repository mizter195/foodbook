const express = require('express');
const router = express.Router();
const commentController = require('../controller/CommentController');
const Message = require('../models/Message');
const async = require('async');
const jwt = require('jsonwebtoken');
const authorization = require('../controller/Authorization');

//POST a comment
router.post('/post', authorization.ensure_authorization, function (req, res) {
    let comment = req.body;
    let user = req.decoded;
    comment.user_id = user.id;
    commentController.post(comment, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//POST delete a comment
router.post('/delete', authorization.ensure_authorization, function (req, res) {
    let user = req.decoded;
    let id = req.body.id;
    commentController.deleteComment(user, id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET all comments of a review by review_id
router.get('/all', function (req, res) {
    let review_id = req.query.review_id;
    commentController.getCommentsOfReview(review_id, function (result, err) {
        if (result) {
            if (result.length !== 0) res.json(new Message(200, result));
            else res.json(new Message(200, 'No record'));
        }
        else res.json(new Message(500, err));
    })
});

module.exports = router;