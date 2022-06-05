const mongoose = require('mongoose');
const Joi = require('joi');

const investmentSchema = new mongoose.Schema({
    name : { type : String, required : true },
    type : { type : String, required : true },
    amount : { type : Number, required : true },
    lastUpdated : { type : Date, required : true }
});

const Investment = mongoose.model('Investment', tradeSchema);

function validateContent(investment) {

    const schema = Joi.object({
        name : Joi.string().required(),
        type : Joi.string().required(),
        amount : Joi.number().required(),
        updateDate : Joi.date().required()
    });

    return schema.validate(investment);
}


module.exports.Investment = Investment;
module.exports.validateContent = validateContent;