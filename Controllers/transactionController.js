const express = require('express');


const transactionService = require('../Services/transactionService');
const endpoints = require('../Constants/endpoints');
const debug = require('debug')('file:transactionController');

const router = express.Router();

const getTransactionHistory = async (req, res) => {
    try {
        res.send(await transactionService.getTransactionsHistoryService());
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

const expenseTransaction = async (req, res) => {
    try {
        res.send(await transactionService.expenseTransactionService(req));
    } catch(err) {
        let error = {
            errorName : err.name,
            status : err.status,
            errorDetails : err.message
        }
        return res.status(err.status).send(error);
    }
}

const incomeTransaction = async (req, res) => {
    try {
        res.send(await transactionService.incomeTransactionService(req));
    } catch(err) {
        let error = {
            errorName : err.name,
            status : err.status,
            errorDetails : err.message
        }
        return res.status(err.status).send(error);
    }
}

const transferTransaction = async (req, res) => {
    try {
        res.send(await transactionService.transferTransactionService(req));
    } catch(err) {
        let error = {
            errorName : err.name,
            status : err.status,
            errorDetails : err.message
        }
        return res.status(err.status).send(error);
    }
}


router.post( endpoints.TRANSACTION_ROUTE.EXPENSE , expenseTransaction);
router.post( endpoints.TRANSACTION_ROUTE.INCOME , incomeTransaction);
router.post( endpoints.TRANSACTION_ROUTE.TRANSFER , transferTransaction);
router.get( endpoints.COMMON.BASIC, getTransactionHistory);

module.exports = router;