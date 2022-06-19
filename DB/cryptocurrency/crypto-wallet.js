const mongoose = require('mongoose');
const Joi = require('joi');

const cryptoWalletSchema = new mongoose.Schema({
    userId : { type : String, required : true },
    token : { type : String, required : true },
    avgEntryPrice: { type : Number, required : true },
    quantity : { type : Number, required : true },
    platform : [{
        code : { type : Number, required : true },
        quantity : { type : Number, required : true },
        avgEntryPrice: { type : Number, required : true },
    }]
});

const CryptoWallet = mongoose.model('CryptoWallet', cryptoWalletSchema);

async function validateContent(wallet) {

    const platformSchema = Joi.object({
        code : Joi.number().required(),
        quantity : Joi.number().required().greater(0),
        avgEntryPrice : Joi.number().required(),
    })

    const schema = Joi.object({
        userId : Joi.string().required(),
        avgEntryPrice : Joi.number().required(),
        token : Joi.string().required(),
        quantity : Joi.number().required().greater(0),
        platform : Joi.array().items(platformSchema)
    });

    return schema.validate(wallet);
}

module.exports.CryptoWallet = CryptoWallet;
module.exports.validateContent = validateContent;