const express = require('express');

const tradeService = require('../Services/tradeService');
const endpoints = require('../Constants/endpoints');

const router = express.Router();

const getBinanceResponse = async (req, res) => {
    res.send(await tradeService.getBinanceResponseService());
}

const getAllOpenTrades = async (req, res) => {
    res.send(await tradeService.getAllOpenTradesService());
}

const closeTrade = async (req, res) => {
    res.status(200).send(await tradeService.closeTradeService(req));
}

const openTrade = async (req, res) => {

    res.send(await tradeService.openTradeService(req));
}



router.post(endpoints.TRADE_ROUTE.ENTRY, openTrade);
router.put(endpoints.TRADE_ROUTE.EXIT, closeTrade);
router.get(endpoints.TRADE_ROUTE.OPEN_TRADES, getAllOpenTrades);
router.get(endpoints.BASE, getBinanceResponse);



module.exports = router;