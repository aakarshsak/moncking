const { Currency, validateContent } = require('../DB/currency');
const { CURRENCY_NAME, COUNTRY, CURRENCY_CODE, BA } = require('../Constants/commonConstants');
const _ = require('lodash');
const debug = require('debug')('file:currencyService');
const EmptyError = require('../Errors/emptyError');
const ValidationError = require('../Errors/validationError');
const Helper = require('../Utilities/helper');
const { SUCCESS_BUT_NO_CONTENT, INVALID_REQ } = require('../Constants/httpErrorStatusCodes');
const CC = require('currency-converter-lt');

const getAllCurrenciesService = async () => {
    let allCurrencies = await Currency.find({});
    if(Helper.isNullOrEmpty(allCurrencies)) {
        debug('details');
        throw new EmptyError('currency', SUCCESS_BUT_NO_CONTENT);
    }
    return allCurrencies;
}


const saveCurrencyInstance = async (obj) => {

    const { error } = validateContent(obj);
    if(error) {
        throw new ValidationError(error.details[0].message, INVALID_REQ);
    }

    let savedResponse;
    try {
        savedResponse = await new Currency(obj).save();
    } catch(err) {
        debug(err.details);
        throw new ValidationError(err.message, INVALID_REQ);
    }


    return savedResponse;
}

const addCurrencyService = async (req) => {
    let properties = [CURRENCY_NAME, CURRENCY_CODE, COUNTRY];
    let currencyObj = _.pick(req.body, properties);
    debug(currencyObj, 'CURRENCY OBJ');

    let savedResponse = saveCurrencyInstance(currencyObj);

    return savedResponse;
}


const convertCurrency = async (from, to, amount) => {
    let currencyConverter = new CC();
    let convertedAmount = await currencyConverter.from(from).to(to).amount(amount).convert();
    debug(convertedAmount, 'converted amoutn');
    return convertedAmount;
}


module.exports = {
    addCurrencyService,
    getAllCurrenciesService,
    convertCurrency
}
