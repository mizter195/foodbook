const User = require('../models/User');
const Review = require('../models/Review');
const Comment = require('../models/Comments');
const UserCategory = require('../models/UserCategory');
const Rate = require('../models/Rate');
const dbConnection = require('../utils/dbConnection');
const sequelize = dbConnection.sequelize;
const Sequelize = dbConnection.Sequelize;
const UserModel = User.sequelize(sequelize, Sequelize);
const ReviewModel = Review.sequelize(sequelize, Sequelize);
const CommentModel = Comment.sequelize(sequelize, Sequelize);
const UserCategoryModel = UserCategory.sequelize(sequelize, Sequelize);
const RateModel = Rate.sequelize(sequelize, Sequelize);
const async = require('async');
const reviewController = require('../controller/ReviewController');


exports.create = function (user, callback) {
    UserModel.create(user).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    });
};

exports.getAll = function (callback) {
    let option = {};
    option.where = {is_admin: 0};
    UserModel.findAll(option).then(function (result) {
        callback(result,null);
    }).catch(function (err) {
        callback(null, err.message);
    });
};

exports.findWithUserNameAdmin = function (username, callback) {
    let option = {
        where: {
            username: username,
            is_admin: 1
        }
    };
    UserModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    });
};

exports.findWithUserName = function (username, callback) {
    let option = {
        where: {
            username: username,
            is_admin: 0
        }
    };
    UserModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    });
};

exports.findWithName = function (name, callback) {
    let option = {
        where: {
            name: name,
            is_admin: 0
        }
    };
    UserModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.findWithEmail = function (email, callback) {
    let option = {
        where: {
            email: email,
            is_admin: 0
        }
    };
    UserModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    });
};

exports.findWithId = function (id, callback) {
    let option = {
        where: {
            id: id,
            is_admin: 0
        }
    };
    UserModel.findAll(option).then(function (result) {
        callback(result, null);
    }).catch(function (err) {
        callback(null, err.message);
    });
};

exports.editProfile = function (id, user, callback) {
    let option = {
        where: {
            id: id
        }
    };
    UserModel.findOne(option).then(function (result) {
        if (result) result.update(user)
            .then(function (result) {
                callback(result, null);
            });
        else callback(null, 'No record!');
    }).catch(function (err) {
        callback(null, err.message);
    })
};

exports.deleteUser = function (user, id, callback) {
    let option = {
        where: {
            id: id
        }
    };
    let option1 = {
        where: {
            user_id: id
        }
    };
    async.waterfall([
        //delete user
        function (cb) {
            UserModel.destroy(option).then(function (result) {
                cb();
            }).catch(function (err) {
                callback(null, err.message);
            })
        },
        //delete review
        function (cb) {
            let i = 0;
            ReviewModel.findAll(option1).then(function (result) {
                if (result.length > 0) {
                    result.forEach(function (item) {
                        i++;
                        reviewController.deleteReview(user, item.dataValues.id, function (result, err) {
                            if (err) callback(null, err);
                        });
                        if (i === result.length) {
                            cb();
                        }
                    });
                } else {
                    cb();
                }
            })
        },
        //delete comments
        function (cb) {
            CommentModel.destroy(option1).then(function (result) {
                cb();
            }).catch(function (err) {
                callback(null, err.message);
            })
        },
        function (cb) {
            RateModel.destroy(option1).then(function (result) {
                cb()
            }).catch(function (err) {
                callback(null, err.message);
            });
        },
        function () {
            UserCategoryModel.destroy(option1).then(function (result) {
                callback('Successfully deleted!', null);
            }).catch(function (err) {
                callback(null, err.message);
            })
        }
    ]);

};