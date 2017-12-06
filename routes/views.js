var express = require('express');
var router = express.Router();
var authen = require('../controller/Authorization')
var router = require('./reviews')
const Message = require('../models/Message');
const reviewController = require('../controller/ReviewController');
const categoryController = require('../controller/CategoryController');
const commentController = require('../controller/CommentController');
const authorization = require('../controller/Authorization');
/* GET home page. */
router.get('/home', authen.session_authorization, function (req, res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to home page--------------------------------------------------------------------------------------------');
    console.log(req.cookies.user)
    res.render('home', {cookie: (req.cookies)});
});
/* GET register page. */
router.get('/register', function (req, res) {
    console.log('go to the register views')
    res.render('register', {cookie: null});
});

/*GET all review page*/
router.get('/allReviews', function (req, res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to allReviews page--------------------------------------------------------------------------------------------');
     if((typeof req.cookies.user) == 'undefined')
    res.render('allReviews', {cookie: null});
     else
         res.render('allReviews', {cookie: (req.cookies)});
});


//get detail of a review by review_id
router.get('/detail',function(req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to detailReview page--------------------------------------------------------------------------------------------');
    // reviewController.getReviewById(req.query.id, function (result, err){
    //     if(result){
    //         console.log(JSON.stringify(result));
    //         if((typeof req.cookies.user) == 'undefined')
    //         res.render('detailReview',{cookie:null,review:result});
    //         else
    //             res.render('detailReview',{cookie:(req.cookies),review:result});
    //     }else{
    //         res.json(new Message(500, err));
    //     }
    // })
    if((typeof req.cookies.user) == 'undefined')
        res.render('detailReview', {cookie: null});
    else
        res.render('detailReview', {cookie: (req.cookies)});
})

//get all review with title in by search
router.get('/searchtitle',function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to search page--------------------------------------------------------------------------------------------');
    if((typeof req.cookies.user) == 'undefined')
        res.render('searchReview', {cookie: null});
    else
        res.render('searchReview', {cookie: (req.cookies)});
})

//get all review by category
router.get('/searchcategory',function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to search page--------------------------------------------------------------------------------------------');
    if((typeof req.cookies.user) == 'undefined')
        res.render('searchCategory', {cookie: null});
    else
        res.render('searchCategory', {cookie: (req.cookies)});
})

//post comment in  a review
router.post('/comment',authorization.ensure_authorization, function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to post comment page--------------------------------------------------------------------------------------------');
    console.log(req.body)
    let comment;
    comment.review_id=req.body.review_id;
    comment.content= req.body.content;
    console.log(comment)
    if((typeof req.cookies.user) == 'undefined')
        res.render('detailReview', {cookie: null});
    else
        res.render('detailReview', {cookie: (req.cookies)});
})

//get profile page
router.get('/profile',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
    '-------------------------------------------go to profile page--------------------------------------------------------------------------------------------')
    if((typeof req.cookies.user) == 'undefined')
        res.render('profile', {cookie: null});
    else
        res.render('profile', {cookie: (req.cookies)});
})

//edit profile
router.get('/editprofile',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to edit profile page--------------------------------------------------------------------------------------------')
    if((typeof req.cookies.user) == 'undefined')
        res.render('editprofile', {cookie: null});
    else
        res.render('editprofile', {cookie: (req.cookies)});
})

//post Review
router.get('/postReview',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to post review page--------------------------------------------------------------------------------------------')
    if((typeof req.cookies.user) == 'undefined')
        res.render('postReview', {cookie: null});
    else
        res.render('postReview', {cookie: (req.cookies)});
})

//get admin page
router.get('/admin',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to admin page--------------------------------------------------------------------------------------------')
    if((typeof req.cookies.user) == 'undefined')
        res.render('admin', {cookie: null});
    else
        res.render('admin', {cookie: (req.cookies)});
})
//get approve review page
router.get('/approve',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to approve review page--------------------------------------------------------------------------------------------')
    if((typeof req.cookies.user) == 'undefined')
        res.render('approveReview', {cookie: null});
    else
        res.render('approveReview', {cookie: (req.cookies)});
})
//get delete Review page
router.get('/deleteReview',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to delete Review page--------------------------------------------------------------------------------------------')
    if((typeof req.cookies.user) == 'undefined')
        res.render('deleteReview', {cookie: null});
    else
        res.render('deleteReview', {cookie: (req.cookies)});
})
//get delete comment page
router.get('/deleteComment',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to delete comment page--------------------------------------------------------------------------------------------')
    console.log(req.query.id_review);
    if((typeof req.cookies.user) == 'undefined')
        res.render('deleteComment', {cookie: null});
    else
        res.render('deleteComment', {cookie: (req.cookies)});
})
//get delete acc page
router.get('/acc',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to delete Account page--------------------------------------------------------------------------------------------')
    if((typeof req.cookies.user) == 'undefined')
        res.render('acc', {cookie: null});
    else
        res.render('acc', {cookie: (req.cookies)});
})
//get delete own review page
router.get('/deleteOwnReview',authorization.session_authorization,function (req,res) {
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------' +
        '-------------------------------------------go to delete own review page--------------------------------------------------------------------------------------------')
    if((typeof req.cookies.user) == 'undefined')
        res.render('deleteOwnReview', {cookie: null});
    else
        res.render('deleteOwnReview', {cookie: (req.cookies)});
})
module.exports = router;
