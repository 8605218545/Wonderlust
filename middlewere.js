
const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError.js"); // for error handling and give message and statusCode
const { listingSchema } = require("./schema.js")  // for Joi (sserver side validation and error handling !its imp)
const { reviewSchema } = require("./schema.js")  // for Joi (sserver side validation and error handling !its imp)
const Review = require("./models/review.js")

// we create this isLoggedIn middlwere for Authentication ( for checking user login or not, if not then we redirect the login page and when login then we use all function on our webpage )
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);                             // check the user id password and store it .
    // console.log(req.path, ".." originalUrl)            // check the path and its orignal url befor the user for login .
    if(!req.isAuthenticated()) {                         // req.isAuthenticated() method check krti h ki user login h ya nhi 
        req.session.redirectUrl = req.originalUrl;       //  store originalUrl (path) in redirectUrl ( jab user kisi path ko access krne ki soch rha h befor login , to vaha jab oo login hota h to usi path k uper redirct ho jo login krne se pehle use access krna chahta h)
        req.flash("error", "Please login the page");
        return res.redirect("/login")
    }
    next();
}


// create a middlewre for jab user kisi path ko access krne ki soch rha h befor login , to vaha jab oo login hota h to usi path k uper redirct ho jo login krne se pehle use access krna chahta h)
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl ;   // and save the req.session.redirectUrl in res.locals.redirectUrl variable ( because our locals are we easy to use anywere in  )
    }
    next();    // otherwise age ki prosses ho
}



// it is middlewre to check who is owner of this listing and check the permission for edit the form 
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id); 
    // console.log(listing)                      // set the listings id in listings
    if(!listing.owner._id.equals(res.locals.currUser._id)) {                    // and aply if condition for check the owner is equals to the currUser (if not then there is flash msg for error)
        req.flash("error", "You dont have permission to edit this!")
        return res.redirect(`/listings/${id}`)
    }
    
    next();
}


// create a middlewre for check review author ( ager hmne kisi rivew ko create kiya h to hm hi use delet ya edit kr skte h otherwise nhi )
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);   // set the review id in review
    // console.log(review)                      // set the listings id in listings
    if(!review.author.equals(res.locals.currUser._id)) {            // and aply if condition for check the author is equals to currUser (if not then there is flash msg for error)
        req.flash("error", "You dont have permission to this!")
        return res.redirect(`/listings/${id}`)
    }
    next();
}



//2nd for simple way server side validation (schema.js)
module.exports.validateListing = (req, res, next ) => {
   let {error} = listingSchema.validate(req.body)
   console.log(error)
   if(error){
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg)
   } else {
       next();
   }
};



// for simple way server side validation of reviews (schema.js)
module.exports.validateReview = (req, res, next ) => {
    let {error} = reviewSchema.validate(req.body)
    console.log(error)
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
};