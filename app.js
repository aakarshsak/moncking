/*Node package manager modules*/

const express = require("express");  //express backend framework package
const cors = require("cors"); //cors to do cross origin requests

/*Custom made local modules*/
const data = require('./routes/data');

/*Making an instance of the express application*/
const app = express();


/*Middlewares for the applications*/
app.use(express.json());


var corsOptions = {
    origin: 'http://ec2-3-145-188-105.us-east-2.compute.amazonaws.com',
    optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));


/*Calling the custom made routes*/
app.use('/data', data);


/*To run the server on the specified port*/
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});