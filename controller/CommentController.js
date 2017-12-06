const Comment = require('../models/Comments');
const dbConnection = require('../utils/dbConnection');
const sequelize = dbConnection.sequelize;
const Sequelize = dbConnection.Sequelize;
const CommentModel = Comment.sequelize(sequelize, Sequelize);
const Op = Sequelize.Op;

exports.post = function (comment, callback) {
    CommentModel.create(comment).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.getCommentsOfReview = function (review_id, callback) {
    let option = {
        where: {
            review_id: review_id
        }
    };
    CommentModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.editComment = function (id, comment, callback) {
    let option = {
        where: {
            id: id
        }
    };
    CommentModel.findOne(option).then(function (result) {
        if (result) result.update(comment)
            .then(function (result) {
                callback(result, null);
            }
        );
        else callback(null, 'No record!');
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.deleteComment = function (user, id, callback) {
    let option = {
        where: {
            id: id
        }
    };
    CommentModel.findOne(option).then(function (result) {
        if (!result) {
            callback(null, 'No record!');
        } else if (result.dataValues.user_id === user.user_id || user.is_admin === 1) {
            CommentModel.destroy(option).then(function (result) {
                callback(result, null);
            });
        } else {
            callback(null, 'No permission delete');
        }
    }).catch(function (err) {
        callback(null, err.message);
    })
};