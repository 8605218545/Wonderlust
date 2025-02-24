

// use Router.route   for combain to same paths

const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");                   
const { saveRedirectUrl } = require("../middlewere.js")
const userControllers = require("../controllers/user.js")    // require the userController


//.......................Sign Up......................................................


// render the signUp form  ( step - 1 )
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})


// create a signUp for user
router.post("/signup", wrapAsync(userControllers.signUp)    // set the all controlle of sign up in our signup path (signUp of userControllers)    
)




// // Router.route
// // using router.route for combain to same paths ( step - 2 )
// router.route("/signup")
// .get((req, res) => {
//     res.render("users/signup.ejs")
// })
// .post( wrapAsync(userControllers.signUp)    // set the all controlle of sign up in our signup path (signUp of userControllers)    
// )



//................................... Login ..........................................................


// render the login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})


// route for login user
// use saveRedirectUrl middlewre for redirect the same path after login 
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userControllers.logIn)    // set the all controlle of logIn in our login path (login of userControllers)

// passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),  // passport. authenticate() is middleware which will authenticate the request. jab hm login kr rhe tab ye check krta h ki jo register data h oo or login data h oo same h ya nhi, ager same nhi hota h to failureRedirect fir se login page pr leke ayega or ek failureflash msg ayega or ager login data same h to oo successfuly login hoga 




// // Router.route
// // using router.route for combain to same paths ( step - 2 )
// router.route("/login")
// .get( (req, res) => {
//     res.render("users/login.ejs")
// })
// .post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userControllers.logIn)







//....................................logOut ...................................................

// create route for logOut
router.get("/logout", userControllers.logOut)   // set the all controlle of logOut in our logOut path (logOut of userControllers)



module.exports = router;     // export the router module

