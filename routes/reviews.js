const express = require('express')
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews')
const { isLoggedIn,validateReview } = require('../middleware');


router.post('/',validateReview, isLoggedIn , catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn, catchAsync(reviews.deleteReview))

module.exports = router