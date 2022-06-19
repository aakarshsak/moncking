const  { CryptoWallet, validateContent } = require('../../DB/cryptocurrency/crypto-wallet');
const ValidationError = require('../../Errors/validationError');
const { INVALID_REQ, UNPROCESSABLE, NOT_FOUND } = require('../../Constants/httpErrorStatusCodes');
const { BUY, SELL, QUANTITY, AVG_ENTRY_PRICE, TOKEN, USER_ID, PLATFORM, CODE, TEST_USER_ID } = require('../../Constants/commonConstants');
const InvalidRequestError = require('../../Errors/invalidRequestError');
const CalculationError = require('../../Errors/calculationError');
const EmptyError = require('../../Errors/emptyError');
const debug = require('debug')('file:cryptoWalletService');


const getWalletTokensService = async () => {
    const userId = TEST_USER_ID;
    const tokenObjList = await CryptoWallet.find({ userId });
    if(tokenObjList.length === 0){
        throw new EmptyError('token', NOT_FOUND);
    }
    return tokenObjList;
}

const checkTokenExistReturn = async (token, userId) => {
    const tokenObj = await CryptoWallet.find({ token, userId });
    if(tokenObj.length === 0) return null;
    return tokenObj[0];
}

const saveTokenInstance = async (obj) => {
    const { error } = await validateContent(obj);
    if(error) {
        throw new ValidationError(error.details[0].message, INVALID_REQ);
    }

    let savedResponse;
    try {
        savedResponse = await new CryptoWallet(obj).save();
    } catch(err) {
        throw new ValidationError(err.message, INVALID_REQ);
    }

    return savedResponse;
}


const updateTokenInstance = async (obj) => {

    let savedResponse;
    try {
        if(obj[QUANTITY] === 0) {
            try {
                savedResponse = await CryptoWallet.deleteOne({ token : obj[TOKEN], userId : obj[USER_ID] } );
                return savedResponse;
            } catch(err) {
                throw new CalculationError(err.message, INVALID_REQ);
            }
        }
        debug(obj, 'line 46...');
        savedResponse = await CryptoWallet.updateOne({ token : obj[TOKEN], userId : obj[USER_ID] } , { $set : obj });
    } catch(err) {
        throw new ValidationError(err.message, INVALID_REQ);
    }
    return savedResponse;
}

const increaseQuantity = (oldQuantity, newQuantity, oldAvgPrice, newAvgPrice) => {
    let quantity = ( newQuantity + oldQuantity );
    let avgEntryPrice = ( (newQuantity * newAvgPrice) + (oldQuantity * oldAvgPrice) ) / quantity;

    return {
        quantity,
        avgEntryPrice
    }
}

const calculateNetAverage = (platforms) => {
    let totalPrice = 0;
    let netQuantity = 0;
    for(let platform of platforms) {
        totalPrice+=platform[AVG_ENTRY_PRICE]*platform[QUANTITY];
        netQuantity+=platform[QUANTITY];
        debug(totalPrice, netQuantity, '.looop');
    }
    return totalPrice/netQuantity;
}

const updateIncrementPlatform = (existingTokenObj, tokenObj) => {

    let newPlatform= tokenObj[PLATFORM][0];
    let oldPlatforms = existingTokenObj[PLATFORM];
    let isPlatformExist = false;

    let newQuantity = tokenObj[QUANTITY];
    let newAvgPrice = tokenObj[AVG_ENTRY_PRICE];

    for(let platform of oldPlatforms){
        if(newPlatform[CODE] === platform[CODE]){
            isPlatformExist = true;
            let increasedResult = increaseQuantity(platform[QUANTITY], newQuantity, platform[AVG_ENTRY_PRICE], newAvgPrice);
            platform[QUANTITY] = increasedResult[QUANTITY],
            platform[AVG_ENTRY_PRICE] = increasedResult[AVG_ENTRY_PRICE];
        }
    }

    if(!isPlatformExist){
        existingTokenObj[PLATFORM].push(newPlatform);
    }

    let overallIncreasedResult = increaseQuantity(existingTokenObj[QUANTITY], newQuantity, existingTokenObj[AVG_ENTRY_PRICE], newAvgPrice);
    existingTokenObj[QUANTITY] = overallIncreasedResult[QUANTITY];
    existingTokenObj[AVG_ENTRY_PRICE] = calculateNetAverage(existingTokenObj[PLATFORM]);
    debug(existingTokenObj, 'line 85...');
    return existingTokenObj;
}

const decreaseQuantity = (oldQuantity, newQuantity) => {
    let decreasedResult;
    if(newQuantity <= oldQuantity) {
        decreasedResult = ( oldQuantity - newQuantity );
    } else {
        throw new CalculationError(UNPROCESSABLE);
    }

    return decreasedResult;
}



const updateDecrementPlatform = (existingTokenObj, tokenObj) => {
    let newPlatform= tokenObj[PLATFORM][0];
    let oldPlatforms = existingTokenObj[PLATFORM];
    let isPlatformExist = false;

    let newQuantity = tokenObj[QUANTITY];

    for(let platform of oldPlatforms){
        if(newPlatform[CODE] === platform[CODE]){
            isPlatformExist = true;
            let decreasedResult = decreaseQuantity(platform[QUANTITY], newQuantity);
            platform[QUANTITY] = decreasedResult;
        }
    }

    oldPlatforms = oldPlatforms.filter( platform => platform[QUANTITY] !== 0 )

    if(!isPlatformExist) {
        throw new CalculationError(UNPROCESSABLE);
    }

    existingTokenObj[PLATFORM] = oldPlatforms;
    let overalldecreasedResult = decreaseQuantity(existingTokenObj[QUANTITY], newQuantity);
    existingTokenObj[QUANTITY] = overalldecreasedResult;
    existingTokenObj[AVG_ENTRY_PRICE] = calculateNetAverage(existingTokenObj[PLATFORM]);
    
    return existingTokenObj;
}


const tradeWalletQuantityService = async ( tokenObj, type ) => {
    let existingTokenObj = await checkTokenExistReturn(tokenObj.token, tokenObj.userId);
    let responseResult;
    debug(tokenObj, 'line 83...');
    if(type === BUY) {
        if(existingTokenObj == null) {
            responseResult = await saveTokenInstance(tokenObj);
            return responseResult;
        } else {
            tokenObj = updateIncrementPlatform(existingTokenObj, tokenObj);
        }
    }  
    else if(type === SELL && existingTokenObj !== null) {
        debug('inside line 91 ', existingTokenObj);
        tokenObj = updateDecrementPlatform(existingTokenObj, tokenObj);
    }
    else {
        throw new InvalidRequestError('Transaction Type should be buy or sell. And sell quantity cannot be more than wallet quantity.', INVALID_REQ);
    }

    responseResult = await updateTokenInstance(tokenObj);    
}


module.exports = {
    tradeWalletQuantityService,
    getWalletTokensService
}

