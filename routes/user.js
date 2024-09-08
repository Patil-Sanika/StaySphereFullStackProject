const express = require("express");
const router = express.Router({ mergeParams: true });// Merge parameters from parent routes
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/users.js");

// Signup 
router.route("/signup")
    .get(userController.renderSignupForm)// Render the signup form
    .post(wrapAsync(userController.signup));// Handle user signup with validation and error handling

// Login 
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: '/login',// Redirect to login on failure
            failureFlash: true// Enable flash messages on failure
        }),
        userController.login// Handle user login
    );

// Logout 
router.get("/logout", userController.logout);

module.exports = router;