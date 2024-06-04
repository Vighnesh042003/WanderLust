const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema , reviewSchema} = require("../schema.js");
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js')
const reviewController = require('../controller/review.js');


router.post("/reviews",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

router.delete("/reviews/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;