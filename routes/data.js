const express = require('express');
const axios = require('axios');

const router = express.Router();


router.get("/", async (req, res) => {

    let result;// = "REs";
    const test = 'https://reqres.in/api/users?page=2';
    const binance = "https://api.binance.com/api/v3/time";
    try {
        const response = await axios.get(binance);
        // console.log(response);
        result = response;
    } catch (error) {
        console.error(error);
        result = error;
    }
    console.log(result);

    res.send(result.data);
});


module.exports = router;