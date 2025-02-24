
// Mongoose
// only in mongoDB (use)

const mongoose = require("mongoose");

main()
.then(() => {
    console.log("connection successful")
})
.catch((err) => {
    console.log(err)
})


async function main() {
     await mongoose.connect('mongodb://127.0.0.1:27017/amezon');
}


const bookSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true,
        maxLength : 20   // maximam length 20 
    },
    author: {
        type : String,
    },
    price: {
        type : Number,
        min : [1, "please put value greater than or equal to 1"],   // minimum price 1
    },
    discount: {
        type : Number,
        default : 0,
    },
    category: {
        type : String,
        enum : ["fiction", "non-fiction"]
    },
    genre : {
        type: [String],
    }

})


const Book = mongoose.model("Book", bookSchema);  

// let book1 = new Book({title: "English", author: "John sen", price: 999 })
// book1.save()
// .then((res) => {
//     console.log(res)
// })
// .catch((err => {
//     console.log(err)
// }))


// let book3 = new Book({title: "Physics", author: "martin", price: "899", category: "fiction" , genre: ["study","knowledge"]})
// book3.save()
// .then((res) => {
//     console.log(res)
// })
// .catch((err => {
//     console.log(err)
// }))


Book.findByIdAndUpdate("668b9110d619953bca8fa541", {price: 900} , {runValidators : true})
.then((res) => {
    console.log(res)
})
.catch((err) => {
    console.log(err.errors.price.properties);
})
