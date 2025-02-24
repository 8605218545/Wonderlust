
const User = require("../models/user.js"); 


// create controller for SignUp the form
module.exports.signUp = async (req, res) => {   // aslo use for handle error wrapAsync ( mongoose error handling)
    try {
        let {username, email, password} = req.body;    // take the username, email, password from our signUp form
        const newUser = new User({ email, username });   // set email and username in newUser from taking this in our form
        const registerUser = await User.register(newUser, password);  // set the newUser is a user name and password is there password automaticaly store in database ( it is register(user, password, cb) method to Convenience method to register a new user instance with a given password. Checks if username is unique and also check password also unique automaticaly )
        console.log(registerUser);   // store the signUp data in registerUser.

        req.login(registerUser, (err) => {     // login method use to directly login when we signup the page .
            if(err) {
                return next(err);
            };

            req.flash("success", "User registered Successfuly..!")   // flash the massege User registered
            // res.redirect("/login")   // go to login page
            res.redirect("/listings")   // go to listings page
        })
          
    } catch (error) {
        req.flash("error", error.message)  // flash the message for error
        res.redirect("/signup")  // if ager error ata h to redirect signup page pr vps aajye
    }
    }



// create a controller for Login Form
module.exports.logIn = async (req, res)  => {  
    req.flash("success", "User logged In successfuly..!")  
    let redirctUrl = res.locals.redirectUrl || "/listings"    // user OR operator  for redirect the page
    res.redirect(redirctUrl)    // set the originalUrl path to redirect the same path of usr when they login the page and ager directly user login ho to oo sidhe listings pr jaye
}    



// create a controller for logOut
module.exports.logOut = (req, res, next) => {
    req.logout((err) => {         // logout is a method to direclty log out the user (is logout krne k liye hi use krte h )
        if(err) {
           return next(err)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    });
}