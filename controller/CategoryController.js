const Category = require('../models/Category');
const ReviewCategory = require('../models/ReviewCategory');
const UserCategory = require('../models/UserCategory');
const User = require('../models/User');
const dbConnection = require('../utils/dbConnection');
const sequelize = dbConnection.sequelize;
const Sequelize = dbConnection.Sequelize;
const CategoryModel = Category.sequelize(sequelize, Sequelize);
const ReviewCategoryModel = ReviewCategory.sequelize(sequelize, Sequelize);
const UserCategoryModel = UserCategory.sequelize(sequelize, Sequelize);
const UserModel = User.sequelize(sequelize, Sequelize);
const Op = Sequelize.Op;

exports.getAllCategory = function (callback) {
    CategoryModel.findAll().then(function (result) {
        callback(result, null);
    }).catch(function (error) {
        callback(null, error.message);
    })
};

exports.getCategoriesOfReview = function (review_id, callback) {
    let option = {
        where: {
            review_id: review_id
        }
    };
    ReviewCategoryModel.findAll(option).then(function (result) {
        if (result.length > 0) {
            let cResult = [];
            result.forEach(function (item) {
                let category_id = item.dataValues.category_id;
                let option = {
                    where: {
                        id: category_id
                    }
                };
                CategoryModel.findOne(option).then(function (categoryResult) {
                    cResult.push(categoryResult);
                    if (cResult.length === result.length) {
                        callback(cResult, null);
                    }
                }).catch(function (err) {
                    callback(null, err.message);
                })
            })
        } else callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

function generateRow(user_id, callback) {
    let category = [];
    let option = {
        order: [['category_id', 'ASC']],
        where: {
            user_id: user_id
        }
    };
    UserCategoryModel.findAll(option).then(function (result) {
        for (let i = 1; i < 6; i++) {
            let isExist = false;
            for (let j = 0; j < result.length; j++) {
                if (i === parseInt(result[j].dataValues.category_id)) {
                    category.push(parseInt(result[j].dataValues.click));
                    isExist = true;
                    break;
                }
            }
            if (!isExist) category.push(0)
        }
        callback(category, null);
    }).catch(function (err) {
        callback(null, err.message);
    });
}

exports.generateMatrix = function (callback) {
    let matrix = [];
    let listUser = [];
    UserModel.findAll().then(function (result) {
        for (let i = 0; i < result.length; i++) {
            let user_id = result[i].dataValues.id;
            listUser.push(user_id);
            generateRow(user_id, function (r_result, err) {
                if (r_result) {
                    matrix.push(r_result);
                    if (matrix.length === result.length) {
                        let response = {
                            listUser: listUser,
                            matrix: matrix
                        };
                        console.log(matrix)
                        callback(response, null);
                    }
                } else callback(null, err);
            })
        }
    }).catch(function (err) {
        callback(null, err);
    })
};
