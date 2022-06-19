const mongoose = require('mongoose');
const Joi = require('joi');

const cryptoPlatformSchema = new mongoose.Schema({
    name : { type : String, required : true },
    code : { type : Number, required : true, unique : true }
});

const CryptoPlatform = mongoose.model('CryptoPlatform', cryptoPlatformSchema);

function validateContent(platform) {

    const schema = Joi.object({
        name : Joi.string().required(),
        code : Joi.number().required().greater(0),
    });

    return schema.validate(platform);
}


module.exports.CryptoPlatform = CryptoPlatform;
module.exports.validateContent = validateContent;