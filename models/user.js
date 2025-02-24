
// set user schema
// const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")   // it include in built user-name and password schema in passport-local-mongoose

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
    },

    
});

userSchema.plugin(passportLocalMongoose);   // automaticaly it include hashing, salting, username and password schema etc., thats why we plugin this .

module.exports = mongoose.model("User", userSchema);