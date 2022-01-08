const express = require('express');
const axios = require('axios');

const router = express.Router();


router.get("/", async (req, res) => {

    let result;// = "REs";
    const test = 'https://reqres.in/api/users?page=2';
    const binance = "https://api.binance.com/api/v3/exchangeInfo";
    try {
        const response = await axios.get(binance);
        // console.log(response);
        result = response;
    } catch (error) {
        console.log("Status", );
        res.status(error.response.status).send(error);
    }
    // console.log(result);

    res.send(result.data);
});

router.get("/level", async (req, res) => {

    let result = {
        data : {
            timezone : "UTC"
        }
    };// = "REs";
    
    // console.log(result);

    res.send(result.data);
});


module.exports = router;