

if(process.env.SCRETEKEY != "production") {
    require('dotenv').config()              // require for .env file
}
// console.log(process.env.SCRETEKEY)    // for print our screte key ( remove befor send any one )


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");  
// const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override")  
const ejsMate = require("ejs-mate")  
const wrapAsync = require("./utils/wrapAsync.js")   
const ExpressError = require("./utils/ExpressError.js"); 
const { listingSchema } = require("./schema.js")  
const { reviewSchema } = require("./schema.js")  
const Review = require("./models/review.js"); 

const listingRouter = require("./routes/listing.js");   
const reviewRouter = require("./routes/review.js")      
const userRouter = require("./routes/user.js")

const session = require("express-session")      
const MongoStore = require('connect-mongo');    
const flash = require('connect-flash');       

const passport = require("passport");    
const LocalStrategy = require("passport-local");  
const User = require("./models/user.js")   


let port = 3000;



// // connect the database
// async function main(){
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }


// // connect the database and  deployment on clound ( mongoDB atlas )
const mongoDB = process.env.ATLASDB_URL

async function main() {
    mongoose.connect(mongoDB);
}



// use then and catch for data and error
main()
    .then(() => {
        console.log("connection successful")
    })
    .catch((err) => {
        console.log(err)
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));   // set all viewa page as globle 
app.use(express.static(path.join(__dirname, "public"))) // for style.css
app.use(express.urlencoded ({extended: true})); 
app.use(methodOverride("_method"));  
app.engine('ejs', ejsMate);



const store = MongoStore.create({       
    mongoUrl: mongoDB,                 
    crypto: {                           
        secret: process.env.SECRET,     
    },
    touchAfter: 24 * 3600,            
});


store.on("error", () => {              // find for error in mongo session
    console.log("ERROR IN MONGO SESSION STORE!", err)
})



const sessionOptions = {             
    store,                              
    secret : process.env.SECRET,        
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,      
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,                  
    }
}

app.use(session(sessionOptions));     
app.use(flash());      

// for more detail - google npm - passport / passport-local-mongoose
app.use(passport.initialize());  
app.use(passport.session())      
passport.use(new LocalStrategy(User.authenticate()));  

passport.serializeUser(User.serializeUser());     
passport.deserializeUser(User.deserializeUser());   // deserializeUser() - it Generates a function that is used by Passport to deserialize users into the session



    // for server sode error handling 
function asyncWrap(fn) {
    return function(req, res, next) {
        fn(req, res, next)
        .catch((err) => {
            next(err)
        })
    };
}


// for validation of review
    const validateReview = (req, res, next ) => {
        let {error} = reviewSchema.validate(req.body)
        console.log(error)
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg)
        } else {
            next();
        }
    };


// create a moddliwre for show flash msg
    app.use((req, res, next) => {
        res.locals.success = req.flash("success");   // local = hm req.user ko ejs file k under direclty access nhi kr skte h to isliye usko hm apne local me store karte h fir uske bad usse ejs file me use krte h
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;       // local - hm directly req.user ko ejs file me access nhi kr skte h isliye use hmapne locals me save krte h.
        next()
    })



    app.use("/listings", listingRouter);               // use our listing from our router 
    app.use("/listings/:id/reviews", reviewRouter)      // use our review from our router 
    app.use("/", userRouter)      // use our review from our router 


// for error handling (when user type anything wrong in create listing page then there is show error  )
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some Error Is Found " } = err;
    // res.status(statusCode).send(message)
    res.render("error.ejs", { message })
    next()
})



app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})