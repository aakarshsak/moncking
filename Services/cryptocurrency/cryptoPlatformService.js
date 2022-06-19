const { CryptoPlatform, validateContent } = require('../../DB/cryptocurrency/platforms'); 
const { CODE, NAME } = require('../../Constants/commonConstants');
const { NOT_FOUND, INVALID_REQ } = require('../../Constants/httpErrorStatusCodes');
const EmptyError = require('../../Errors/emptyError');
const ValidationError = require('../../Errors/validationError');
const _ = require('lodash');
const debug = require('debug')('file:cryptoPlatformService');

const getAllPlatformsService = async () => {
    const platformsList = await CryptoPlatform.find({});
    if(platformsList.length === 0) {
        throw new EmptyError('platform', NOT_FOUND);
    }
    return platformsList;
}

const getPlatfromNameForCodeService = async (code) => {
    const platform = await CryptoPlatform.find({code});
    if(platform.length === 0) {
        throw new EmptyError('platform', NOT_FOUND);
    }
    return platform[0];
}


const savePlatform = async (obj) => {
    const { error } = validateContent(obj);
    if(error) {
        debug(error.details);
        throw new ValidationError(error.details[0].message, INVALID_REQ);
    }

    let savedResponse;
    try {
        debug(obj);
        savedResponse = await new CryptoPlatform(obj).save();
    } catch(err) {
        debug(obj, 'line 37....');
        throw new ValidationError(err.message, INVALID_REQ);
    }

    return savedResponse;
}


const addPlatformService = async (req) => {
    const properties = [CODE, NAME];
    let platformObj = _.pick(req.body, properties);

    let responseResult = await savePlatform(platformObj);
    return responseResult;
}


module.exports = {
    addPlatformService,
    getAllPlatformsService,
    getPlatfromNameForCodeService
}