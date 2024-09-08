// Import necessary models, utilities, and schemas
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema} = require("./schema.js");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;// Save the original URL for redirecting after login
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();// Proceed to the next middleware if authenticated
}

// Middleware to save and clear the redirect URL from session
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl;// Save redirect URL to locals
        delete req.session.redirectUrl; // Clear redirect URL from session 
    }
    next();// Proceed to the next middleware
};

// Middleware to check if the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Check if the current user is the owner
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    
    next();// Proceed to the next middleware if the user is the owner
};


// Middleware to validate the listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");// Collect all error messages
        throw new ExpressError(400, errMsg);// Throw an error if validation fails
    } else {
        next();
    }
};


// Middleware to validate the review data using Joi schema
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else {
        next();
    }
};


// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author fo this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};