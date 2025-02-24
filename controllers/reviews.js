
// Review Controller

const Review = require("../models/review.js");  // get the listing schema from listing.js
const Listing = require("../models/listing.js");  // get the listing schema from listing.js



// create a controller for create new reviews
module.exports.createReview = async (req, res) => {
    // Find the listing
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);          // set review in newReview
    newReview.author = req.user._id;   // set the user id in newReview.author 
    console.log(newReview)  // show author ki id in reviview details in console

    // Push the saved review into the listing's reviews array
    listing.reviews.push(newReview);

    await newReview.save();  // save new added review
    await listing.save();    // also save in listing

    req.flash("success", "New review is created!")
    // Redirect to the listing's page
    res.redirect(`/listings/${listing._id}`);
}



// create a controller for delete reviews
module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})   // use $pull (pull opertor) for delete the review ( listing k andr jo reviews arry h uske under jake us reviewId ko dudenga or pull use delte kr dega)
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!")
    res.redirect(`/listings/${id}`);

}