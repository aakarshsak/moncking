const ENDPOINTS = {
    COMMON : {
        BASIC : "/",
        ADMIN : "/admin"
    },
    TRADE_ROUTE : {
       BASIC: '/trades',
       OPEN_TRADES : '/open-trades-list',
       ENTRY : '/enter-trade',
       EXIT : "/exit-trade",
    },
    TRANSACTION_ROUTE : {
        BASIC: '/transactions',
        EXPENSE: '/expense',
        INCOME: '/income',
        TRANSFER: '/transfer'
    },
    BANK_ROUTE : {
        BASIC: '/admin/banks',
        ADD_BANK: '/add-bank',
        GET_BANKS: '/get-banks'
    },
    CURRENCY_ROUTE : {
        BASIC: '/admin/currencies',
        ADD_CURRENCY: '/add-currency'
    },
    WALLET_ROUTE : {
        BASIC: '/wallets',
        ADD_WALLET: '/add-wallet',
        WALLETS_AMT_BY_ID: '/:userId/net'
    }
    
}


module.exports = ENDPOINTS;