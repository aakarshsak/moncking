const mongoose = require('mongoose');
const Joi = require('joi');

const transactionSchema = new mongoose.Schema({
    userId : { type : String, required : true }, // id of the user for whose accounnt this transaction was made    
    transactionId : { type : String, required : false },   // id of the transaction done on the platform
    name : { type : String, required : true },  // name of the transaction
    type : { type : String, required : true }, // expense/transfer/income these are the types
    amount : { type : Number, required : true }, // amount in the transaction
    platform : { type : String, required : true }, // whichever platform the transaction has been made
    dateTime : { type : Date, required : true }, // date/time 
    mode : { type : String, required : true }, // cash/upi/internet
    category : { type : String, required : true }, // which kind of item for which this transaction is made
    currencyCode : { type : String, required : true },
    recipient : { 
        name : { type : String, required : true },
        platform : { type : String, required : true },
        type : { type : String, required : true }
    }, // reciepient 
    sender : { 
        name : { type : String, required : true },
        platform : { type : String, required : true },  ////// which platform this wallet is on for bank it will be bank name
        type : { type : String, required : true }  // cash / bank / crypto / stock etc.
    }  
});

const Transaction = mongoose.model('Transaction', transactionSchema);

function validateContent(transaction) {

    const senderReciever = Joi.object({
        name : Joi.string().required(),
        platform : Joi.string().required(),
        type : Joi.string().required()
    })

    const schema = Joi.object({
        userId : Joi.string().required(),
        transactionId : Joi.string().required(),
        name : Joi.string().required(),
        type : Joi.string().required(),
        amount : Joi.number().required(),
        dateTime : Joi.date().required(),
        platform : Joi.string().required(),
        mode : Joi.string().required(),
        category : Joi.string().required(),
        currencyCode : Joi.string().required(),
        recipient : senderReciever,
        sender : senderReciever
    });

    return schema.validate(transaction);
}


module.exports.Transaction = Transaction;
module.exports.validateContent = validateContent;