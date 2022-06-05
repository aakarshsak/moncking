/*Node package manager modules*/
const express = require("express");  //express backend framework package
const cors = require("cors"); //cors to do cross origin requests
const morgan = require("morgan"); //http request logger package for developement
const mongoose = require("mongoose");  //mongoose module to interact with the mongodb database
const debug = require('debug')('file:app');

/*Custom made local modules*/
const endpoints = require('./Constants/endpoints');
const trades = require('./Controllers/tradeController');
const transactions = require('./Controllers/transactionController');
const banks = require('./Controllers/bankController');
const currencies = require('./Controllers/currencyController');
const wallets = require('./Controllers/walletController');

/*Making an instance of the express application*/
const app = express();


/*Making Connection with the mongodb hub-gyan database*/
const DB = "moncking";
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI + DB ,{ useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => debug('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));



/*Middlewares for the applications*/
app.use(express.json());
if(app.get('env') == 'development') 
    app.use(morgan('tiny'));  // To post the http request onto the console
app.use(cors());


/*Calling the custom made routes*/
app.use(endpoints.TRADE_ROUTE.BASIC, trades);
app.use(endpoints.TRANSACTION_ROUTE.BASIC, transactions);
app.use(endpoints.BANK_ROUTE.BASIC, banks);
app.use(endpoints.CURRENCY_ROUTE.BASIC, currencies);
app.use(endpoints.WALLET_ROUTE.BASIC, wallets);


/*To run the server on the specified port*/
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
console.log("Port : ", port);
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});