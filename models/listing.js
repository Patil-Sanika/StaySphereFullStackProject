// Import mongoose for database interaction
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

// Define the schema for a listing
const listingSchema = new Schema({
    title:{
        type:String,
        require:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    country:String,
    location: String, 
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category: Number,
});

// Middleware to handle deletion of reviews when a listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({reviews:{$in:listing.reviews}});
    }
});

// Create the Listing model from the schema
const Listing = mongoose.model("Listing",listingSchema);

// Export the Listing model
module.exports = Listing;
