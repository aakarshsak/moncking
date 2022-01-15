const mongoose = require('mongoose');
const Joi = require('joi');
const { number } = require('joi');

const tradeSchema = new mongoose.Schema({
    tokenName : { type : String, required : true },
    buy : { type : Boolean, required : true },
    entryAmt: { type : Number, required : true },
    open : { type : Boolean, required : true, default : true },
    exitAmt : { type : Number },  
    type : { type : String, required : true },
    quantity : { type : Number, required : true } 
});

const Trade = mongoose.model('Trade', tradeSchema);

function validateContent(trade) {

    const schema = Joi.object({
        tokenName : Joi.string().required(),
        buy : Joi.boolean().required(),
        entryAmt : Joi.number().required(),
        open : Joi.boolean().required(),
        type : Joi.string().required(),
        exitAmt : Joi.string(),
        quantity : Joi.number().required()
    });

    return schema.validate(trade);
}


module.exports.Trade = Trade;
module.exports.validateContent = validateContent;