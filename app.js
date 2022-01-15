/*Node package manager modules*/
const express = require("express");  //express backend framework package
const cors = require("cors"); //cors to do cross origin requests
const morgan = require("morgan"); //http request logger package for developement
const mongoose = require("mongoose");  //mongoose module to interact with the mongodb database


/*Custom made local modules*/
const endpoints = require('./Constants/endpoints');
const data = require('./Controllers/tradeController');

/*Making an instance of the express application*/
const app = express();


/*Making Connection with the mongodb hub-gyan database*/
const DB = "hub-gyan";
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI + DB ,{ useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));



/*Middlewares for the applications*/
app.use(express.json());
if(app.get('env') == 'development') 
    app.use(morgan('tiny'));  // To post the http request onto the console
app.use(cors());


/*Calling the custom made routes*/
app.use(endpoints.TRADE_ROUTE.TRADE, data);


/*To run the server on the specified port*/
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
console.log("Port : ", port);
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});