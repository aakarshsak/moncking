const mongoose = require('mongoose');
const Joi = require('joi');

const walletSchema = new mongoose.Schema({
    userId : { type : String, required : true }, //  user's id
    name : { type : String, required : true }, // name of the wallet given 
    type : { type : String, required : true },  // cash / bank / crypto / stock etc.
    platform : { type : String, required : true }, /// which platform this wallet is on for bank it will be bank name
    balance : { type : Number, default: 0 }, /// amount of money in the wallet.
    currencyCode : { type : String, required : true },  // currency in which this money is saved.
    createdDateTime : { type : Date, required : true }
});

const Wallet = mongoose.model('Wallet', walletSchema);


async function isUniqueUserPlatformCombination(wallet) {
    let listofWallets = await Wallet.find({ userId : wallet.userId, platform : wallet.platform, type : wallet.type });
    console.log('lIst of wallet ', listofWallets);
    if(listofWallets.length === 0) {
        return true;
    }
    return false;
}

async function validateContent(wallet) {

    let isUniqueFlag = await isUniqueUserPlatformCombination(wallet);
    if(!isUniqueFlag){
        return {
            error : {
                details : [
                    {
                        message : 'UserId, Platform and platform type combination already exist.'
                    }
                ]
            }
        }
    }

    const schema = Joi.object({
        userId : Joi.string().required(),
        name : Joi.string().required(),
        type : Joi.string().required(),
        balance : Joi.number().default(0),
        platform : Joi.string().required(),
        currencyCode : Joi.string().required(),
        createdDateTime : Joi.date().required()
    });

    console.log(schema.validate(wallet), 'validating wllet in the 39');
    
    return schema.validate(wallet);
}


module.exports.Wallet = Wallet;
module.exports.validateContent = validateContent;