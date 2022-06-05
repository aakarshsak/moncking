const mongoose = require('mongoose');
const Joi = require('joi');

const currencySchema = new mongoose.Schema({
    currencyName : { type : String, required : true },
    currencyCode : { type : String, required : true },
    country : { type : String, required : true}
 });

const Currency = mongoose.model('Currency', currencySchema);

function validateContent(currency) {

    const schema = Joi.object({
        currencyName : Joi.string().required(),
        currencyCode : Joi.string().required(),
        country : Joi.string().required()
    });

    return schema.validate(currency);
}


module.exports.Currency = Currency;
module.exports.validateContent = validateContent;