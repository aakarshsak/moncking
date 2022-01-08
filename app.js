/*Node package manager modules*/

const express = require("express");  //express backend framework package
const cors = require("cors"); //cors to do cross origin requests

/*Custom made local modules*/
const data = require('./routes/data');

/*Making an instance of the express application*/
const app = express();


/*Middlewares for the applications*/
app.use(express.json());
app.use(cors());


/*Calling the custom made routes*/
const base = "/api";
app.use(base + '/data', data);


/*To run the server on the specified port*/
const port = process.env.PORT || 8080;  //Defining the port to the application on port 7800 or 3000
app.listen(port, () => {   //Starting the server
    console.log(`Listening on port : ${port}`);
});