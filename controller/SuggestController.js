const UserCategory = require('../models/UserCategory');
const dbConnection = require('../utils/dbConnection');
const sequelize = dbConnection.sequelize;
const Sequelize = dbConnection.Sequelize;
const UserCategoryModel = UserCategory.sequelize(sequelize, Sequelize);
const Op = Sequelize.Op;

exports.click = function (user_id, category_id, callback) {
    let option = {
        where: {
            user_id: user_id,
            category_id: category_id
        }
    };
    UserCategoryModel.findOne(option).then(function (result) {
        if (result) {
            let current = result.dataValues.click;
            result.updateAttributes({
                click: current + 1
            }).then(function (u_result) {
                callback(u_result, null);
            })
        } else {
            let record = {
                user_id: user_id,
                category_id: category_id,
                click: 1
            };
            UserCategoryModel.create(record).then(function (c_result) {
                callback(c_result, null);
            })
        }
    }).catch(function (err) {
        callback(null, err);
    })
};

exports.getClickTimes = function (user_id, category_id, callback) {
    let option = {
        where: {
            user_id: user_id,
            category_id: category_id
        }
    };
    UserCategoryModel.findOne(option).then(function (result) {
        if (result) callback(result.dataValues, null);
        else callback(null, 'No record!');
    }).catch(function (err) {
        callback(null, err);
    })
};