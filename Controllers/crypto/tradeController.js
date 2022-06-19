const express = require('express');

const tradeService = require('../../Services/cryptocurrency/tradeService');
const endpoints = require('../../Constants/endpoints');
const debug = require('debug')('file:tradeController');

const router = express.Router();

const getBinanceResponse = async (req, res) => {
    res.send(await tradeService.getBinanceResponseService());
}

const getAllTrades = async (req, res) => {
    try {
        res.send(await tradeService.getAllTradesService());
    } catch(err) {
        let error = {
            errorName : err.name,
            status : err.status,
            errorDetails : err.message
        }
        return res.status(err.status).send(error);
    }
}

const addTrade = async (req, res) => {
    try {
        res.send(await tradeService.addTradeService(req));
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

router.post(endpoints.TRADE_ROUTE.ADD_TRADE, addTrade);
router.get(endpoints.COMMON.BASIC, getAllTrades);




module.exports = router;