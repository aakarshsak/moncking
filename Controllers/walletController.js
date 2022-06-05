const express = require('express');


const walletService = require('../Services/walletService');
const endpoints = require('../Constants/endpoints');
const debug = require('debug')('file:walletController');

const router = express.Router();

const addWallets = async (req, res) => {
    try {
        res.send(await walletService.addWalletService(req));
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

const getWallets = async (req, res) => {
    try {
        res.send(await walletService.getAllWalletsService());
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


const getNetWalletAmountForUser = async (req, res) => {
    let userId = req.params.userId;
    try {
        res.send(await walletService.netWalletAmountForUserid(userId, 'INR'));
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


router.post(endpoints.WALLET_ROUTE.ADD_WALLET, addWallets);
router.get(endpoints.COMMON.BASIC, getWallets);
router.get(endpoints.WALLET_ROUTE.WALLETS_AMT_BY_ID, getNetWalletAmountForUser);

module.exports = router;