

const express = require("express");
const router = express.Router({ mergeParams: true });   // mergeParams: true - it use for marging the listing and review routes
const wrapAsync = require("../utils/wrapAsync.js")   // wrapAsync is call for error handling 
const ExpressError = require("../utils/ExpressError.js"); // for error handling and give message and statusCode
const { reviewSchema } = require("../schema.js")  // for Joi (sserver side validation and error handling !its imp)
const Review = require("../models/review.js");  // get the listing schema from listing.js
const { listingSchema } = require("../schema.js")  // for Joi (sserver side validation and error handling !its imp)
const Listing = require("../models/listing.js");  // get the listing schema from listing.js
const { isLoggedIn } = require("../middlewere.js")  // require this isLoggedIn middlwere for Authentication ( checking user login or not )
const { validateReview } = require("../middlewere.js")   // for validation
const { isReviewAuthor } = require("../middlewere.js")
const reviewControllers = require("../controllers/reviews.js")




// Review 
// post review routes ( isLoggedIn - check for user login h ya nhi ,  ager user login tabhi oo review create kr skta h)
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview)
);


// delete review routes
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewControllers.deleteReview )



module.exports = router;