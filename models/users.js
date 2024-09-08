// Import mongoose for database interaction
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');// Import passport-local-mongoose plugin

// Define the schema for a user
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Plugin to add username, hash and salt fields to the user schema, as well as methods for authentication
userSchema.plugin(passportLocalMongoose);

// Create the User model from the schema and export it
module.exports = mongoose.model('User', userSchema);
