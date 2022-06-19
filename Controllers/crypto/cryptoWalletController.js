const express = require('express');

const cryptoWalletService = require('../../Services/cryptocurrency/cryptoWalletService');
const endpoints = require('../../Constants/endpoints');
const debug = require('debug')('file:cryptoWalletController');

const router = express.Router();

const getAllWalletTokens = async (req, res) => {
    try {
        res.send(await cryptoWalletService.getWalletTokensService());
    } catch(err) {
        let error = {
            errorName : err.name,
            status : err.status,
            errorDetails : err.message
        }
        return res.status(err.status).send(error);
    } 
}

router.get(endpoints.COMMON.BASIC, getAllWalletTokens);

module.exports = router;