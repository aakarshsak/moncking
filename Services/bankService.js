const { Bank, validateContent } = require('../DB/bank');
const { BANK_NAME, COUNTRY, BANK_CODE_NAME } = require('../Constants/commonConstants');
const _ = require('lodash');
const debug = require('debug')('file:bankService');
const EmptyError = require('../Errors/emptyError');
const ValidationError = require('../Errors/validationError');
const Helper = require('../Utilities/helper');
const { SUCCESS_BUT_NO_CONTENT, INVALID_REQ } = require('../Constants/httpErrorStatusCodes');

const getAllBanksService = async () => {
    let allBanks = await Bank.find({});
    if(Helper.isNullOrEmpty(allBanks)) {
        debug('details');
        throw new EmptyError('bank', SUCCESS_BUT_NO_CONTENT);
    }
    return allBanks;
}


const saveBankInstance = async (obj) => {

    const { error } = validateContent(obj);
    if(error) {
        throw new ValidationError(error.details[0].message, INVALID_REQ);
    }

    let savedResponse;
    try {
        savedResponse = await new Bank(obj).save();
    } catch(err) {
        debug(err.details);
        throw new ValidationError(err.message, 400);
    }


    return savedResponse;
}

const addBankService = async (req) => {
    let properties = [BANK_NAME, BANK_CODE_NAME, COUNTRY];
    let bankObj = _.pick(req.body, properties);
    debug(bankObj, 'BANK OBJ');

    let savedResponse = saveBankInstance(bankObj);

    return savedResponse;
}


module.exports = {
    addBankService,
    getAllBanksService
}
