const _ = require('lodash');
const { validateContent, Transaction } = require('../DB/transaction');
const { save } = require('debug/src/browser');
const debug = require('debug')('file:transactionService');
const Helper = require('../Utilities/helper');
const ValidationError = require('../Errors/validationError');
const { TRANSACTION_ID, SENDER, RECIPIENT, AMOUNT, MODE, TEST_USER_ID, NAME, TYPE, PLATFORM, CATEGORY, NOT_APPLICABLE, CURRENCY_CODE, TRANSFER, INCOME, EXPENSE } = require('../Constants/commonConstants');
const { SUCCESS_BUT_NO_CONTENT, INVALID_REQ } = require('../Constants/httpErrorStatusCodes');
const walletService = require('../Services/walletService');

const getTransactionsHistoryService = async () => {
    
    let allTransactions;
    try {
        allBanks = await Transaction.find({});
    } catch (error) {
        debug(error, 'details');
        throw new EmptyError('transaction', SUCCESS_BUT_NO_CONTENT);
    }
    return allTransactions;
}

const saveTransaction = async (obj) => {
    const { error } = validateContent(obj);
    if(error) {
        debug(error.details);
        throw new ValidationError(error.details[0].message, INVALID_REQ);
    }

    let savedResponse;
    try {
        debug('Nice');
        savedResponse = await new Transaction(obj).save();
    } catch(err) {
        throw new ValidationError(err.message, INVALID_REQ);
    }

    return savedResponse;
}

const incomeTransactionService = async (req) => {
    let properties = [TRANSACTION_ID, NAME, AMOUNT, PLATFORM, MODE, CATEGORY, CURRENCY_CODE, SENDER, RECIPIENT];
    let incomeTransactionObj = _.pick(req.body, properties);

    if(Helper.isNullOrEmptyString(incomeTransactionObj.transactionId))
        incomeTransactionObj.transactionId = NOT_APPLICABLE;
    
    incomeTransactionObj.userId = TEST_USER_ID;

    incomeTransactionObj.dateTime = new Date().toString();
    debug(incomeTransactionObj, 'income');

    transferTransactionObj.type = INCOME;

    await walletService.creditWalletAmount(incomeTransactionObj);
    responseResult = await saveTransaction(incomeTransactionObj);
    
    return responseResult;
}


const expenseTransactionService = async (req) => {

    let properties = [TRANSACTION_ID, NAME, AMOUNT, PLATFORM, MODE, CATEGORY, CURRENCY_CODE, SENDER, RECIPIENT];
    let expenseTransactionObj = _.pick(req.body, properties);

    if(Helper.isNullOrEmptyString(expenseTransactionObj.transactionId))
        expenseTransactionObj.transactionId = NOT_APPLICABLE;
    
    expenseTransactionObj.userId = TEST_USER_ID;

    expenseTransactionObj.dateTime = new Date().toString();
    debug(expenseTransactionObj, 'expense');

    transferTransactionObj.type = EXPENSE;

    await walletService.debitWalletAmount(expenseTransactionObj);
    responseResult = await saveTransaction(expenseTransactionObj);
    
    return responseResult;
}

const transferTransactionService = async (req) => {
    let properties = [NAME, AMOUNT, PLATFORM, MODE, CATEGORY, CURRENCY_CODE, SENDER, RECIPIENT];
    let transferTransactionObj = _.pick(req.body, properties);

    if(Helper.isNullOrEmptyString(transferTransactionObj.transactionId))
        transferTransactionObj.transactionId = NOT_APPLICABLE;
    
    transferTransactionObj.userId = TEST_USER_ID;

    transferTransactionObj.type = TRANSFER;

    transferTransactionObj.dateTime = new Date().toString();
    debug(transferTransactionObj, 'transfer');

    await walletService.transferWalletAmount(transferTransactionObj);
    responseResult = await saveTransaction(transferTransactionObj);
    
    return responseResult;
}


module.exports = {
    getTransactionsHistoryService,
    expenseTransactionService,
    incomeTransactionService,
    transferTransactionService
}