const express = require('express');

const cryptoPlatformService = require('../../Services/cryptocurrency/cryptoPlatformService');
const endpoints = require('../../Constants/endpoints');
const debug = require('debug')('file:cryptoPlatformController');

const router = express.Router();

const getAllPlatforms = async (req, res) => {
    try {
        res.send(await cryptoPlatformService.getAllPlatformsService());
    } catch(err) {
        let error = {
            errorName : err.name,
            status : err.status,
            errorDetails : err.message
        }
        return res.status(err.status).send(error);
    } 
}


const addPlatform = async (req, res) => {
    try {
        res.send(await cryptoPlatformService.addPlatformService(req));
    } catch(err) {
        debug(err);
        let error = {
            errorName : err.name,
            status : err.status,
            errorDetails : err.message
        }
        return res.status(err.status).send(error);
    }
}


router.get(endpoints.COMMON.BASIC, getAllPlatforms);
router.post(endpoints.CRYPTO_PLATFORM_ROUTE.ADD_PLATFORM, addPlatform)

module.exports = router;