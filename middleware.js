const Listing = require('./models/listing');
const Review = require('./models/review');
const { listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be Logged in to Add listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing =await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
    console.log(listingSchema);
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details[0].message)
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) =>{
    console.log(reviewSchema);
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details[0].message)
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,reviewId} = req.params;
    let review =await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}