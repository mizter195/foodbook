const multer = require('multer');
const image = require('../models/ReviewImage');
const db = require('../utils/dbConnection');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const ImageModel = image.sequelize(sequelize, Sequelize);
const Op = Sequelize.Op;

//Storage for avatar
let avatarStorage = multer.diskStorage({
    destination:function (req, file, callback) {
        callback(null, "./public/uploads/avatar")
    },
    filename:function (req, file, callback) {
        callback(null, file.fieldname + '_' + Date.now() + '.png');
    }
});

//Storage for review
let reviewStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/uploads/review")
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '_' + Date.now() + '.png');
    }
});

exports.uploadAvatar = multer({ storage: avatarStorage }).single('avatar');

exports.uploadReview = multer({ storage: reviewStorage }).array('review', 100);

exports.saveReviewImage = function (names, review_id, callback) {
    let i_result = [];
    names.forEach(function (name) {
        let image = {
            name: name,
            review_id: review_id
        };
        ImageModel.create(image).then(function (res) {
            i_result.push(res.dataValues);
            if (i_result.length === names.length) {
                callback(i_result, null);
            }
        }).catch(function (err) {
            callback(null, err);
        });
    });
};

exports.getReviewImage = function (review_id, callback) {
    let option = {
        where: {
            review_id: review_id
        }
    };
    ImageModel.findAll(option).then(function (res) {
        callback(res, null);
    }).catch(function (err) {
        callback(null, err);
    })
};