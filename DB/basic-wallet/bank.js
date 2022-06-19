const mongoose = require('mongoose');
const Joi = require('joi');

const bankSchema = new mongoose.Schema({
    bankName : { type : String, required : true },
    bankCodeName : { type : String, required : true },
    country : { type : String, required : true }
});

const Bank = mongoose.model('Bank', bankSchema);

function validateContent(bank) {

    const schema = Joi.object({
        bankName : Joi.string().required(),
        bankCodeName : Joi.string().required(),
        country : Joi.string().required()
    });

    return schema.validate(bank);
}


module.exports.Bank = Bank;
module.exports.validateContent = validateContent;