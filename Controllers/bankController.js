const express = require('express');


const bankService = require('../Services/bankService');
const endpoints = require('../Constants/endpoints');
const debug = require('debug')('file:bankController');

const router = express.Router();

const addBank = async (req, res) => {
    try {
        res.send(await bankService.addBankService(req));
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

const getBanks = async (req, res) => {
    try {
        res.send(await bankService.getAllBanksService());
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


router.post(endpoints.BANK_ROUTE.ADD_BANK, addBank);
router.get(endpoints.COMMON.BASIC, getBanks);

module.exports = router;