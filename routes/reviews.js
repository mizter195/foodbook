const express = require('express');
const router = express.Router();
const reviewController = require('../controller/ReviewController');
const Message = require('../models/Message');
const async = require('async');
const jwt = require('jsonwebtoken');
const authorization = require('../controller/Authorization');
const categoryController = require('../controller/CategoryController');
const suggestController = require('../controller/SuggestController');
const uploadController = require('../controller/UploadController');
const Recommender = require('../utils/suggestion');

//POST a review
router.post('/post', authorization.ensure_authorization, function (req, res) {
    let review = req.body;
    let user = req.decoded;
    review.is_pending = 1;
    review.user_id = user.id;
    if (!review.title || review.title.replace(/ /g, '') === '') {
        res.json(new Message(500, 'Review title must not be blank!'));
    } else if (!review.content || review.content.replace(/ /g,'') === '') {
        res.json(new Message(500, 'Review content must not be blank!'));
    } else if (!review.address || review.address.replace(/ /g, '') === '') {
        res.json(new Message(500, 'Review address must not be blank!'));
    } else if (!review.rate) {
        res.json(new Message(500, 'Review rate must not be null!'));
    } else if (!review.categories || JSON.parse(review.categories).length === 0) {
        res.json(new Message(500, 'Review categories must not be null'));
    } else {
        let categories = JSON.parse(review.categories);
        reviewController.post(review, categories, function (result, err) {
            if (result) res.json(new Message(200, result));
            else res.json(new Message(500, err));
        })
    }
});

//GET review by category
router.get('/reviewbycategory', function (req, res) {
    let query = req.query;
    reviewController.getReviewByCategory(query.category_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET all category
router.get('/category', function (req, res) {
    categoryController.getAllCategory(function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET search a review with title
router.get('/search', function (req, res) {
    let string = req.query.request;
    reviewController.searchWithTitle(string, function (result, err) {
        if (result) {
            if (result.length !== 0) res.json(new Message(200, result));
            else res.json(new Message(200, "No record!"));
        }
        else res.json(new Message(500, err));
    })
});

//GET a review with id
router.get('/get', function (req, res) {
    let id = req.query.id;
    reviewController.getReviewById(id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//POST edit review
router.post('/edit', authorization.ensure_authorization, function (req, res) {
    let user_id = req.decoded.id;
    let review = req.body;
    let id = review.id;
    let categories = null;
    if (review.categories) categories = JSON.parse(review.categories);
    reviewController.editReview(user_id, id, review, categories, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET all review
router.get('/all', function (req, res) {
    reviewController.getAllApproved(function (result,err) {
        if (result) {
            if (result.length !== 0) res.json(new Message(200, result));
            else res.json(new Message(200, "No record!"));
        }
        else res.json(new Message(500, err));
    })
});

//GET all pending review
router.get('/pending', authorization.ensure_authorization, function (req, res) {
    let user = req.decoded;
    if (user.is_admin !== 1) res.json(new Message(500, 'No permission admin!'));
    else {
        reviewController.getAllPending(function (result, err) {
            if (result) {
                if (result.length !== 0) res.json(new Message(200, result));
                else res.json(new Message(200, "No record!"));
            }
            else res.json(new Message(500, err));
        });
    }
});

//POST approve review
router.post('/approve', authorization.ensure_authorization, function (req, res) {
    let user = req.decoded;
    let review_id = req.body.id;
    if (user.is_admin !== 1) res.json(new Message(500, 'No permission admin!'));
    else {
        reviewController.approveReview(review_id, function (result, err) {
            if (result) res.json(new Message(200, result));
            else res.json(new Message(500, err));
        })
    }
});

//POST delete review
router.post('/delete', authorization.ensure_authorization, function (req, res) {
    let user = req.decoded;
    let review_id = req.body.id;
    reviewController.deleteReview(user, review_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET categories of review
router.get('/categories', function (req, res) {
    let review_id = req.query.review_id;
    categoryController.getCategoriesOfReview(review_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//POST record click review
router.post('/record', authorization.ensure_authorization, function (req, res) {
    let review_id = req.body.review_id;
    let user_id = req.decoded.id;
    categoryController.getCategoriesOfReview(review_id, function (result, err) {
        if (result) {
            let e_result = [];
            result.forEach(function (item) {
                let category_id = item.dataValues.id;
                suggestController.click(user_id, category_id, function (c_result, err) {
                    if (c_result) e_result.push(c_result);
                    else res.json(new Message(500, err));
                    if (e_result.length === result.length) res.json(new Message(200, e_result));
                })
            })
        } else res.json(new Message(500, err));
    })
});

//GET click times
router.get('/record', authorization.ensure_authorization, function (req, res) {
    let user_id = req.decoded.id;
    let category_id = req.query.category_id;
    suggestController.getClickTimes(user_id, category_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//POST save image to db
router.post('/image', authorization.ensure_authorization, function (req, res) {
    let images = req.body;
    let names = JSON.parse(images.names);
    let review_id = images.review_id;
    uploadController.saveReviewImage(names, review_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET get images of review
router.get('/image', function (req, res) {
    let review_id = req.query.review_id;
    uploadController.getReviewImage(review_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET get recent reviews
router.get('/recent', function (req, res) {
    let limit = req.query.limit;
    reviewController.getAllRecentApproved(limit, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET reviews by user id
router.get('/userid', function (req, res) {
    let user_id = req.query.user_id;
    reviewController.getReviewByUserId(user_id, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

router.get('/suggest', function (req, res) {
    let user_id = req.query.user_id;
    console.log(123)
    categoryController.generateMatrix(function (result, err) {
        console.log(123123)
        if (result) {
            console.log(result);
            let recommend = new Recommender(result.matrix, result.listUser);
            let index = recommend.showpredict(user_id);
            let category_id = parseInt(index) + 1;
            let response = {
                category_id: category_id
            };
            res.json(new Message(200, response));
        }
        else res.json(new Message(500, err));
    })
});

module.exports = router;