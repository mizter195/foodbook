const Rate = require('../models/Rate');
const dbConnection = require('../utils/dbConnection');
const sequelize = dbConnection.sequelize;
const Sequelize = dbConnection.Sequelize;
const RateModel = Rate.sequelize(sequelize, Sequelize);
const Op = Sequelize.Op;

exports.rate = function (rate, callback) {
    let option = {
        where: {
            user_id: rate.user_id,
            review_id: rate.review_id
        }
    };
    RateModel.findOne(option).then(function (result) {
        if (result) {
            result.update(rate).then(function (result) {
                callback(result, null);
            })
        }  else {
            RateModel.create(rate).then(function (result) {
                callback(result, null);
            }).catch(function (err) {
                callback(null, err.message);
            })
        }
    });
};

exports.getRateScore = function (review_id, callback) {
    let option = {
        where: {
            review_id: review_id
        }
    };
    RateModel.findAll(option).then(function (result) {
        let total = 0;
        let rate = {};
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                total += result[i].dataValues.rate;
            }
            rate = {
                score: Math.round(total / result.length)
            };
        } else {
            rate = {
                score: 0
            };
        }
        callback(rate, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.getRateOfUser = function (user_id, review_id, callback) {
    let option = {
        where: {
            user_id: user_id,
            review_id: review_id
        }
    };
    RateModel.findOne(option).then(function (result) {
        if (result) callback(result, null);
        else callback(null, 'No record!');
    }).catch(function (err) {
        callback(null, err.message);
    });
};