
// Listings Controller

const Listing = require("../models/listing");  // get the listing schema from listing.js


// create a controller for index route ( show all listings on our page)
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});        // for show all data on page put in allListings variable
    console.log("listing render successfully")
    res.render("./listings/index.ejs", { allListings } );   // and reder the all data of listings on our web page

}



// create a controller for render the new listing form 
module.exports.renderNewListingForm = (req, res) => {      // isLoggedIn it is middlewere for Authentication
    res.render("listings/new.ejs")         // render the new.ejs page from views/listing/new.ejs when click on add new button
}



// create a controller for render show listing page with listing data 
module.exports.rederShowListing = async (req, res, next) => {      // create a middlewre for error handling (next)
    try {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: { path: "author" }}).populate("owner");  // populate = for get reviews data with also get outher data( for show on review author.username) , and also get the owner data 
    if(!listing) {
        // next(new ExpressError(404, "Listing is not found"));  // expressError to show error
        req.flash("error", "Listing is not exist!")   // use connect-flash for disply this msg
        res.redirect("/listings")                   // and redirect to our listing page

    }
    // console.log(listing)    // show all details of listing in console
    res.render("listings/show.ejs", { listing } );
    }
    catch(err) {
    next(err)
    }
}




// Controller to create a new listing
module.exports.renderCreateListing = async (req, res, next) => {
    try {
        if (!req.file) {
            req.flash("error", "Image upload is required!");
            return res.redirect("/listings/new"); // Redirect back to the form
        }

        let url = req.file.path;                               //  get the path from file ( post(create route) listing.js/routes/)
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);       // take the listing in req.body.listing and set in newListing
        newListing.owner = req.user._id;                        // store this user(owner) info (id) in our every created listing ( and this store in our listing schema)
        newListing.image = { url, filename };                   // save the image data from req.file ( url and filename )

        await newListing.save();                                // Save new listing to DB
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};





// create a controller for render Edit listing page
module.exports.renderEditListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    // changes for image adjust ( cloudianry changes ( search google))
    let originalImageUrl = listing.image.url
    originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl })     // pass the listing in edit.ejs like ( listing.title, listing.id etc. )
}



// create a controller for edit and Update the listing 
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;                                    // teke the id form req.params
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing } );    // set (findByIdAndUpdate  method) the update listings in listing
    console.log(listing) 
    

    if(typeof req.file !== "undefined") {    // if req.file ka type unefine nhi h to ye sara print hoga ()
    let url = req.file.path;           // get the path from file ( post(create route) listing.js/routes/)
    let filename = req.file.filename;
   
    listing.image = { url, filename }    // and set the listing image as url and this filename( cloudinary )
    await listing.save();                 // and save the updated listings
   
   }

    req.flash("success", "Edit the Listing!")                   // use connect-flash for disply this msg
    res.redirect(`/listings/${id}`)
}



// create a controller for delete listings 
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);    // set the delete listing in deleteListing ( findByIdAndDelete(id)  this method use to delete the listing)
    console.log(deleteListing)
    console.log("this is deleted listing")
    req.flash("success", "deleted Listing!")   // use connect-flash for disply this msg
    res.redirect("/listings")
}

