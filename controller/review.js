const Listing = require("../models/listing");
const Review = require("../models/review");

// Controller to handle the creation of a new review for a listing
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(newReview);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New review Created!");
    res.redirect(`/listings/${listing._id}`);
};

// Controller to handle the deletion of a review from a listing
module.exports.destroyReview = async(req,res)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate()
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
};