// Import required modules and middleware
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});// Set up multer with Cloudinary storage

// Route to handle getting all listings and creating a new listing
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,// Middleware to check if user is logged in
        upload.single('listing[image]'),// Middleware to handle image upload
        validateListing, // Middleware to validate the listing data
        wrapAsync(listingController.createListing));// Controller to create a new listing
   
//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// Edit Route 
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports = router;// Export the router