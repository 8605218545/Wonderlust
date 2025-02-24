
const mongoose = require("mongoose")
const initData = require("./data.js")           // get the data form data.js
const Listing = require("../models/listing.js")  

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}   

main()
    .then(() => {
        console.log("connection successful")
    })
    .catch((err) => {
        console.log(err)
    })



const initDB = async () => {
    await Listing.deleteMany({});  // delete the data before in the listing
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "67b06b9ba95940f37d68ee7b" }));   // add automatic this owner id with every new listings when we create the new listing
    await Listing.insertMany(initData.data);   // puting new data from data.js in listing
    console.log("data was initialize");
}

initDB();  // and call the fun. 