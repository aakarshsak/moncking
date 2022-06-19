const express = require('express');


const currencyService = require('../../Services/basic-wallet-services/currencyService');
const endpoints = require('../../Constants/endpoints');
const debug = require('debug')('file:currencyController');

const router = express.Router();

const addCurrency = async (req, res) => {
    try {
        res.send(await currencyService.addCurrencyService(req));
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

const getCurrency = async (req, res) => {
    try {
        res.send(await currencyService.getAllCurrenciesService());
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


router.post(endpoints.CURRENCY_ROUTE.ADD_CURRENCY, addCurrency);
router.get(endpoints.COMMON.BASIC, getCurrency);

module.exports = router;