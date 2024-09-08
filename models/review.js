// Import mongoose for database interaction
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for a review
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating : {
        type:Number,
        required: true,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
});

// Create the Review model from the schema and export it
module.exports = mongoose.model("Review",reviewSchema);