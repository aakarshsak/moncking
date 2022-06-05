
const axios = require('axios');
const _ = require('lodash');
const { validateContent, Trade } = require('../DB/trade');
const debug = require('debug')('file:tradeService');


const getBinanceResponseService = async () => {

    let result, count = 0;// = "REs";
    const binance = "https://api.binance.com/api/v3/exchangeInfo";
    try {
        const response = await axios.get(binance);
        // console.log(response);
        let symbols = response.data.symbols;
        result = symbols.map(item => {
            count++;
            return {
                symbol : item.symbol,
                baseAsset : item.baseAsset,
                quoteAsset : item.quoteAsset
            }
        });
    } catch (error) {
        debug("Status" );
        res.status(error.response.status).send(error);
    }
    // console.log(result);
    const finalRes = {
        count,
        result
    }

    return finalRes;
}

const getAllOpenTradesService = async () => {
    const openTradesList = await Trade.find({ open : true });
    return openTradesList;
}

const closeTradeService = async (req) => {
    const id = req.query.id;

    const obj = _.pick(req.body, ["exitAmt"]); 

    if(!id){
        return res.status(400).send("Invalid Request.");
    }
    
    let record = await Trade.findById(id); //Saving the content into the databas
    record.open = false;
    record.exitAmt = obj.exitAmt;
    record = await Trade.updateOne( {_id : req.query.id}, record );

    return record;
}


const openTradeService = async (req) => {
    const list = ["tokenName", "buy", "entryAmt", "type", "quantity"];

    const obj = _.pick(req.body, list); //Picking the title, author, article, codes from the request body using lodash
    obj.open = true;
    
    const { error } = validateContent(obj);
    if(error) {
        // debug(error.details[0].message) ;
        return res.status(400).send(error.details[0].message);
    }

    record = await new Trade(obj).save(); //Saving the content into the database
    
    let response;

    if(record) {
        response = {
            id : record._id,
            message : "Saved successfully."
        }
    }

    return response;
}


module.exports = {
    getBinanceResponseService,
    getAllOpenTradesService,
    closeTradeService,
    openTradeService
}