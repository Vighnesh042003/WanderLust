// const Joi = require('joi');

// const listingSchema = Joi.object({
//         // Define your schema fields here
//         title: Joi.string().required(),
//         price: Joi.number().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required()
//         // other fields
//     }).required();

    
// module.exports = listingSchema;

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow('').optional()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating :Joi.number().min(1).max(5).required(),
        comment : Joi.string().required(),
    }).required()
});


