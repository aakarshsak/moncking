
const axios = require('axios');
const _ = require('lodash');
const { validateContent, Trade } = require('../../DB/cryptocurrency/trade');
const cryptoWalletService = require('../cryptocurrency/cryptoWalletService');
const cryptoPlatformService = require('../cryptocurrency/cryptoPlatformService');
const debug = require('debug')('file:tradeService');
const { MAIN_TOKEN, BASE_TOKEN, AVG_ENTRY_PRICE, FEE, QUANTITY, TYPE, TEST_USER_ID, USER_ID, TOKEN, PLATFORM } = require('../../Constants/commonConstants');
const { INVALID_REQ, NOT_FOUND } = require('../../Constants/httpErrorStatusCodes');
const ValidationError = require('../../Errors/validationError');
const EmptyError = require('../../Errors/emptyError');


const getBinanceResponseService = async () => {

    let result, count = 0;// = "REs";
    const binance = "https://api.binance.com/api/v3/exchangeInfo";
    try {
        const response = await axios.get(binance);
        // console.log(response);
        let symbols = response.data.symbols;
        result = symbols.map(item => {
            count++;
            return {
                symbol : item.symbol,
                baseAsset : item.baseAsset,
                quoteAsset : item.quoteAsset
            }
        });
    } catch (error) {
        debug("Status" );
        res.status(error.response.status).send(error);
    }
    // console.log(result);
    const finalRes = {
        count,
        result
    }

    return finalRes;
}

const getAllTradesService = async () => {
    const userId = TEST_USER_ID;
    let allTradesList = await Trade.find({userId});
    if(allTradesList.length === 0){
        throw new EmptyError('trade', NOT_FOUND);
    }
    return allTradesList;
}

const saveTrade = async (obj) => {
    const { error } = validateContent(obj);
    if(error) {
        debug(error.details);
        throw new ValidationError(error.details[0].message, INVALID_REQ);
    }

    let savedResponse;
    try {
        debug('Nice');
        savedResponse = await new Trade(obj).save();
    } catch(err) {
        throw new ValidationError(err.message, INVALID_REQ);
    }

    return savedResponse;
}

const addTradeService = async (req) => {
    const properties = [ MAIN_TOKEN, BASE_TOKEN, AVG_ENTRY_PRICE, FEE, TYPE, QUANTITY, PLATFORM ];
    let tradeObj = _.pick(req.body, properties); 

    await cryptoPlatformService.getPlatfromNameForCodeService(tradeObj[PLATFORM]);

    tradeObj.userId = TEST_USER_ID;
    tradeObj.dateTime = new Date().toString();

    const tokenProperties = [ AVG_ENTRY_PRICE, QUANTITY, USER_ID ];
    let tokenObj = _.pick(tradeObj, tokenProperties);
    tokenObj[TOKEN] = tradeObj[MAIN_TOKEN];
    tokenObj[PLATFORM] = [{
        code : tradeObj[PLATFORM],
        quantity : tradeObj[QUANTITY],
        avgEntryPrice : tradeObj[AVG_ENTRY_PRICE]
    }];

    await cryptoWalletService.tradeWalletQuantityService(tokenObj, tradeObj[TYPE]);
    const responseResult = await saveTrade(tradeObj);

    return responseResult;
}


module.exports = {
    getBinanceResponseService,
    getAllTradesService,
    addTradeService
}