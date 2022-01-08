/*Node package manager modules*/

const express = require("express");  //express backend framework package
const cors = require("cors"); //cors to do cross origin requests
const morgan = require("morgan"); //http request logger package for developement

/*Custom made local modules*/
const data = require('./routes/data');

/*Making an instance of the express application*/
const app = express();


/*Middlewares for the applications*/
app.use(express.json());
console.log(app.get('env'));
if(app.get('env') == 'development') 
    app.use(morgan('tiny'));  // To post the http request onto the console
app.use(cors());


/*Calling the custom made routes*/
app.use('/data', data);


/*To run the server on the specified port*/
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
console.log("Port : ", port);
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});