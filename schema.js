// Import Joi for schema validation
const Joi = require('joi');

// Define validation schema for listing
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string().required(),
        price: Joi.number().required().min(0), // Changed to Joi.number()
        image: Joi.string().allow("", null),
    }).required()// The listing object itself is required
});

// Define validation schema for review
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});
