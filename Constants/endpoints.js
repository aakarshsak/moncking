const ENDPOINTS = {
    COMMON : {
        BASIC : "/",
        ADMIN : "/admin"
    },
    TRADE_ROUTE : {
       BASIC: '/trades',    //  GET     /trades                 
       ADD_TRADE : '/add-trade',    //     POST      /trades/add-trade    
    },
    TRANSACTION_ROUTE : {
        BASIC: '/transactions',     //   GET      /transactions
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
        WALLETS_AMT_BY_ID: '/net',   // GET       /wallets/net
    },
    CRYPTO_WALLET_ROUTE : {
        BASIC: '/crypto-wallets',
    },
    CRYPTO_PLATFORM_ROUTE : {
        BASIC: '/admin/crypto-platforms',
        ADD_PLATFORM: '/add-platform',
    }
    
}


module.exports = ENDPOINTS;