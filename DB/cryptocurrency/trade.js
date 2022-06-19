const mongoose = require('mongoose');
const Joi = require('joi');

const tradeSchema = new mongoose.Schema({
    userId : { type : String, required : true },
    mainToken : { type : String, required : true },
    baseToken : { type : String, required : true },
    avgEntryPrice: { type : Number, required : true },
    fee : { type : Number, required : true },
    type : { type : String, required : true },    // buy or sell
    quantity : { type : Number, required : true },
    dateTime : { type : Date, required : true },
    platform : { type : Number, required : true }
});

const Trade = mongoose.model('Trade', tradeSchema);

function validateContent(trade) {

    const schema = Joi.object({
        userId : Joi.string().required(),
        mainToken : Joi.string().required(),
        baseToken : Joi.string().required(),
        avgEntryPrice : Joi.number().required(),
        fee : Joi.number().required(),
        type : Joi.string().required(),
        quantity : Joi.number().required(),
        dateTime : Joi.date().required(),
        platform : Joi.number().required().greater(0)
    });

    return schema.validate(trade);
}


module.exports.Trade = Trade;
module.exports.validateContent = validateContent;