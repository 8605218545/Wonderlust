
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")   // wrapAsync is call for error handling 
const Listing = require("../models/listing.js");  // get the listing schema from listing.js
const { isLoggedIn } = require("../middlewere.js")  // require this isLoggedIn middlwere for Authentication ( checking user login or not )
const { isOwner } = require("../middlewere.js")    // check for owner ( for edit or delete permission ( only owner has permision))
const { validateListing } = require("../middlewere.js")
const listingsController = require("../controllers/listings.js")
const multer  = require('multer')                   // require the multer for upload multipart/form data( multipal files and form data)
const { storage } = require("../cloudConfig.js")   // require the storage form cloudconfig file
const upload = multer({ storage })        // desteny : 'storage'  means outomaticaly create a uploads folder and store the uploads images


// show all data on page (Index routes) 
router.get("/", wrapAsync(listingsController.index)     // set the listingsController.index in our controller  of "/" ( index of listingsController)
);
// http://localhost:3000/listings



// add new route (for add new listing on our page) 
router.get("/new", isLoggedIn, listingsController.renderNewListingForm)    // reder /new route of new listing form



// // Show routes (view details of listings) (Read = crud)
router.get("/:id", listingsController.rederShowListing)
;




// Create Route
// create create listing route to save new.ejs data in a database(mongoDB) and listings.ejs
router.post("/", isLoggedIn, upload.single("listing[image]"), wrapAsync (listingsController.renderCreateListing)
);

// // use multer for upload.single("listing[image]") and store the image in upload folder  ( and see all Data of our listings in Object froms)
// router.post("/", upload.single("listing[image]"), (req, res) => {
//     res.send(req.file)    // send the data on backend 
// });
// // check data save on our cloudinary / dashboard / media librery / folder / wonderlust_DEV 




 // edit the listing
 router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingsController.renderEditListing)
)




// edit and update the listing by use put request ( upade = crud) , [ upload.single("listing[image]") this middlewre set the image for upload (multer)]
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing ,wrapAsync(listingsController.updateListing)
);




// delete route (delete the listings)   ( delete = crud)
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing)
);



module.exports = router