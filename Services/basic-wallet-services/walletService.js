const { Wallet, validateContent } = require('../../DB/basic-wallet/wallet');
const { TEST_USER_ID, TEST_USER_NAME, NAME, PLATFORM, TYPE, CURRENCY_CODE } = require('../../Constants/commonConstants');
const _ = require('lodash');
const debug = require('debug')('file:walletService');
const EmptyError = require('../../Errors/emptyError');
const ValidationError = require('../../Errors/validationError');
const InvalidRequestError = require('../../Errors/invalidRequestError');
const InvalidAmountError = require('../../Errors/invalidAmountError');
const Helper = require('../../Utilities/helper');
const { NOT_FOUND, INVALID_REQ } = require('../../Constants/httpErrorStatusCodes');
const currencyService = require('./currencyService');

const getAllWalletsService = async () => {
    let allWallets = await Wallet.find({});
    if(Helper.isNullOrEmpty(allWallets)) {
        debug('details');
        throw new EmptyError('wallet', NOT_FOUND);
    }
    return allWallets;
}


const saveWalletInstance = async (obj) => {

    const { error } = await validateContent(obj);
    if(error) {
        throw new ValidationError(error.details[0].message, INVALID_REQ);
    }

    let savedResponse;
    try {
        savedResponse = await new Wallet(obj).save();
    } catch(err) {
        debug(err.details);
        throw new ValidationError(err.message, INVALID_REQ);
    }


    return savedResponse;
}

const addWalletService = async (req) => {
    let properties = [NAME, TYPE, PLATFORM, CURRENCY_CODE];
    let walletObj = _.pick(req.body, properties);

    walletObj.userId = TEST_USER_ID;

    walletObj.createdDateTime = new Date().toString();
    debug(walletObj, 'WALLET  OBJ');

    let savedResponse = saveWalletInstance(walletObj);

    return savedResponse;
}

const debitWalletAmount = async (transaction) => {
    let { userId, sender, amount } = transaction;
    let listofWallets = await Wallet.find({ userId, platform: sender.platform, type: sender.type });
    if( listofWallets.length === 1 ) {
        let wallet = listofWallets[0];
        if( wallet.balance > amount ){
            wallet.balance-=amount;
            await Wallet.updateOne({_id: wallet._id}, { $set : {balance: wallet.balance}});
        }
        else {
            throw new InvalidAmountError(amount, INVALID_REQ);
        }
    } else {
        throw new EmptyError('such wallet', NOT_FOUND);
    }
}

const creditWalletAmount = async (transaction) => {
    let { userId, recipient, amount } = transaction;
    let listofWallets = await Wallet.find({ userId, platform: recipient.platform, type: recipient.type });
    if( listofWallets.length === 1 ) {
        let wallet = listofWallets[0];
        wallet.balance+=amount;
        await Wallet.updateOne({_id: wallet._id}, { $set : {balance: wallet.balance}});
    } else {
        throw new EmptyError('such wallet', NOT_FOUND);
    }
}

const transferWalletAmount = async (transaction) => {
    let { userId, recipient, amount, sender } = transaction;

    if(sender.type === recipient.type && sender.platform === recipient.platform){
        throw new InvalidRequestError('Both wallet cannot be same.', INVALID_REQ);
    }

    let listofWalletsSender = await Wallet.find({ userId, platform: sender.platform, type: sender.type });
    let listofWalletsRecipient = await Wallet.find({ userId, platform: recipient.platform, type: recipient.type });

    if( listofWalletsSender.length === 1 && listofWalletsRecipient.length === 1) {
        let walletSender = listofWalletsSender[0];
        let walletRecipient = listofWalletsRecipient[0];
        walletSender.balance-=amount;
        walletRecipient.balance+=amount;
        await Wallet.updateOne({_id: walletSender._id}, { $set : {balance: walletSender.balance}});
        await Wallet.updateOne({_id: walletRecipient._id}, { $set : {balance: walletRecipient.balance}});

    } else {
        throw new EmptyError('such wallet', NOT_FOUND);
    }
}


const netWalletAmountForUserid = async () => {
    userId = TEST_USER_ID;
    currency = 'INR';
    let listOfWallets = await Wallet.find({userId});
    if(listOfWallets.length === 0){
        throw new EmptyError('wallet', NOT_FOUND);
    }

    let netAmount = 0;
    for(let wallet of listOfWallets) {
        if(currency != wallet.currencyCode){
            netAmount+= await currencyService.convertCurrency(wallet.currencyCode, currency, wallet.balance);
        }
        netAmount+=wallet.balance;
    }

    return { 
        userId, 
        netAmount, 
        userName: TEST_USER_NAME 
    };
}


module.exports = {
    addWalletService,
    getAllWalletsService,
    debitWalletAmount,
    creditWalletAmount,
    transferWalletAmount,
    netWalletAmountForUserid
}
