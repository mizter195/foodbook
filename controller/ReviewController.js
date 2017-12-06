const Review = require('../models/Review');
const ReviewCategory = require('../models/ReviewCategory');
const Comment = require('../models/Comments');
const Rate = require('../models/Rate');
const ReviewImage = require('../models/ReviewImage');
const dbConnection = require('../utils/dbConnection');
const sequelize = dbConnection.sequelize;
const Sequelize = dbConnection.Sequelize;
const ReviewModel = Review.sequelize(sequelize, Sequelize);
const CommentModel = Comment.sequelize(sequelize, Sequelize);
const ReviewCategoryModel = ReviewCategory.sequelize(sequelize, Sequelize);
const RateModel = Rate.sequelize(sequelize, Sequelize);
const ReviewImageModel = ReviewImage.sequelize(sequelize, Sequelize);
const Op = Sequelize.Op;
const async = require('async');
const CategoryController = require('../controller/CategoryController');
const ImageController = require('../controller/UploadController');

exports.post = function (review, category_array, callback) {
    ReviewModel.create(review).then(function (result) {
        let categories = [];
        category_array.forEach(function (category_id) {
            let reviewCategory = {
                review_id: result.id,
                category_id: category_id
            };
            ReviewCategoryModel.create(reviewCategory).then(function (categoryResult) {
                categories.push(categoryResult.dataValues.category_id);
                if (categories.length === category_array.length) {
                    result.dataValues.categories = categories;
                    callback(result, null);
                }
            }).catch(function (error) {
                callback(null, error.message);
            })
        });
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.getReviewByUserId = function (userId, callback) {
    let option = {
        where: {
            user_id: userId
        }
    };
    ReviewModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.getAllApproved = function (callback) {
    let option = {
        where: {
            is_pending: 0
        }
    };
    ReviewModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.getAllPending = function (callback) {
    let option = {
        where: {
            is_pending: 1
        }
    };
    ReviewModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.getAllRecentApproved = function (limit, callback) {
    let option = {
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']],
        where: {
            is_pending: 0
        }
    };
    ReviewModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.searchWithTitle = function (string, callback) {
    let target = "%" + string + "%";
    let option = {
        where: {
            title: {
                [Op.like]: target
            },
            is_pending: 0
        }
    };
    ReviewModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.getReviewById = function (id, callback) {
    let option = {
        where: {
            id: id
        }
    };
    let option2 = {
        where: {
            review_id: id
        }
    };
    async.waterfall([
        function (cb) {
            ReviewModel.findOne(option).then(function (result) {
                if (result) cb(null, result);
                else callback(null, 'No records!');
            }).catch(function (err) {
                callback(null, err.message);
            });
        },
        function (result, cb) {
            let categories = [];
            CategoryController.getCategoriesOfReview(id, function (res, err) {
                if (res) {
                    for (let i = 0; i < res.length; i++) {
                        let category = res[i].dataValues;
                        categories.push(category);
                    }
                    result.dataValues.categories = categories;
                    cb(null, result);
                } else {
                    callback(null, err)
                }
            })
        },
        function (result) {
            let images = [];
            ImageController.getReviewImage(id, function (res, err) {
                if (res) {
                    for (let i = 0; i < res.length; i++) {
                        let image = res[i].dataValues;
                        images.push(image);
                    }
                    result.dataValues.images = images;
                    callback(result, null);
                } else {
                    callback(null, err)
                }
            })
        }
    ]);

};

exports.getAllReviewOfUser = function (user_id, callback) {
    let option = {
        where: {
            user_id: user_id
        }
    };
    ReviewModel.findAll(option).then(function (result) {
        if (result.length === 0) callback(null, 'No record!');
        else callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.approveReview = function (id, callback) {
    let option = {
        where: {
            id: id
        }
    };
    ReviewModel.findOne(option).then(function (result) {
        if (result) result.updateAttributes({
            is_pending: 0
        }).then(function (result) {
            callback(result, null);
        });
        else {
            callback(null, 'No record!')
        }
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.editReview = function (user_id, id, review, categories, callback) {
    let option = {
        where: {
            id: id,
            user_id: user_id
        }
    };
    let option2 = {
        where: {
            review_id: id
        }
    };
    async.waterfall([
        function (cb) {
            ReviewModel.findOne(option).then(function (result) {
                if (result) result.update(review).then(function (result) {
                    cb(null, result);
                });
                else callback(null, 'No record!');
            }).catch(function (err) {
                callback(null, err.message);
            })
        },
        function (r_result, cb) {
            if (categories) {
                ReviewCategoryModel.destroy(option2).then(function (result) {
                    cb(null, r_result);
                }).catch(function (err) {
                    callback(null, err.message);
                })
            } else {
                callback(r_result, null);
            }
        },
        function (r_result) {
            let resultCategories = [];
            categories.forEach(function (category_id) {
                let reviewCategory = {
                    review_id: id,
                    category_id: category_id
                };
                ReviewCategoryModel.create(reviewCategory).then(function (categoryResult) {
                    resultCategories.push(categoryResult.dataValues.category_id);
                    if (resultCategories.length === categories.length) {
                        r_result.dataValues.categories = resultCategories;
                        callback(r_result, null);
                    }
                }).catch(function (error) {
                    callback(null, error.message);
                })
            });
        }
    ]);
};

exports.deleteReview = function (user, id, callback) {
    let option1 = {
        where: {
            id: id
        }
    };
    let option2 = {
        where: {
            review_id: id
        }
    };
    async.waterfall([
        function (cb) {
            //Check permission
            ReviewModel.findOne(option1).then(function (result) {
                //Case 1: No review record
                if (!result) callback(null, 'No record!');
                else if (result.dataValues.user_id === user.id || user.is_admin === 1) {
                    //Case 2: Have permission to delete
                    cb();
                } else {
                    callback(null, 'No permission to delete!');
                }
            })
        },
        function (cb) {
            //Delete Review
            ReviewModel.destroy(option1).then(function (result) {
                cb();
            }).catch(function (err) {
                callback(null, err);
            })
        },
        function (cb) {
            //Delete comment
            CommentModel.destroy(option2).then(function (result) {
                cb();
            }).catch(function (err) {
                callback(null, err);
            })
        },
        function (cb) {
            //Delete rate
            RateModel.destroy(option2).then(function (result) {
                cb();
            }).catch(function (err) {
                callback(null, err);
            })
        },
        function (cb) {
            //Delete review has categories
            ReviewCategoryModel.destroy(option2).then(function (result) {
                cb();
            }).catch(function (err) {
                callback(null, err);
            })
        },
        function () {
            //Delete review images
            ReviewImageModel.destroy(option2).then(function (result) {
                callback('Successfully deleted!', null);
            }).catch(function (err) {
                callback(null, err);
            })
        }
    ]);
};

exports.getReviewByCategory = function (category_id, callback) {
    let option = {
        where: {
            category_id: category_id
        }
    };
    ReviewCategoryModel.findAll(option).then(function (result) {
        if (result.length === 0) callback(null, 'No record!');
        else {
            let cResult = [];
            let temp = [];
            result.forEach(function (review) {
                let option = {
                    where: {
                        id: review.dataValues.review_id,
                        is_pending: 0
                    }
                };
                ReviewModel.findOne(option).then(function (reviewResult) {
                    if (reviewResult) cResult.push(reviewResult.dataValues);
                    temp.push(reviewResult);
                    if (temp.length === result.length) {
                        callback(cResult, null);
                    }
                }).catch(function (err) {
                    callback(null, err.message);
                })
            })
        }
    }).catch(function (err) {
        callback(null, err.message);
    })
};