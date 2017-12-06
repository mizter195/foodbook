const express = require('express');
const router = express.Router();
const uploadController = require('../controller/UploadController');
const Message = require('../models/Message');

//POST Upload avatar
router.post("/upload", function(req,res) {
    uploadController.uploadAvatar(req, res, function (err) {
        if (err) res.json(new Message(500, err));
        else {
            let avatar = {
                filename: req.file.filename
            };
            res.json(new Message(200, avatar));
        }
    })
});

//POST Upload review
router.post("/upload-review", function (req, res) {
    uploadController.uploadReview(req, res, function (err) {
        console.log(req);
        if (err) res.json(new Message(500, err));
        else {
            let files = [];
            req.files.forEach(function (file) {
                let review = {
                    filename: file.filename
                };
                files.push(review);
            });
            res.json(new Message(200, files))
        }
    })
});

module.exports = router;