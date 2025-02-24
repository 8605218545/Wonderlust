

// create our Schema ( Mongoose )

const mongoose = require("mongoose");
const review = require("./review");
const Review = require("./review.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title: {
        type: String,     // which type of our data
        required: true,    // validation required ( validation for server side )
    },
    description: {
        type: String,
        // type: [String],   // if data is in array format
    },

    // image: {
    //     type: String,
    //     default: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",

    //     set: (v) => v === "" ? "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" : v,
    // },


    image: {       // for cloudinary store this jpg data
        url: String,
        filename: String,
    },

    price: {
        type: Number,
    },
    location: {
        type: String,
        required: true,   // ( validation for server side )
    },
    country: {
        type: String,
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",   // referance from Review schema
        },
    ],
    
    owner: 
        {
        type: Schema.Types.ObjectId,
        ref: "User",   // referance from User schema
        },
        
});


// create a middlewere for when we dlete any listing then also delete with there listing reviews
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: { $in: listing.reviews } })
    };
});


const Listing = mongoose.model("Listing", listingSchema);    // put all schema in Listing (listingSchema)

module.exports = Listing;   // and export the Listing

