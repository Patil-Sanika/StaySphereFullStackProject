// Load environment variables from .env file in non-production environments
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


// Import necessary modules and packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/booking');

const User = require("./models/users.js");

// Import route handlers
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// Database connection URL
const dbUrl = process.env.ATLASDB_URL;


// Connect to MongoDB
main()
    .then(() => {
        console.log("connected to ")
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
}


// Set up view engine and static file directory
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Start the server
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,// Time period in seconds
});

// Handle session store errors
store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

// Configure session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,// 7 days in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,// 7 days in milliseconds
        httpOnly: true,
    }
};

// Set Booking 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', bookingRoutes);


// Set up session and flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Initialize and configure Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Set up flash messages and current user for use in templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// Use route handlers
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// Handle undefined routes with a custom error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"));
})

// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});

// Start the server
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});