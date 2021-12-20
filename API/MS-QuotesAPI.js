import express from 'express';
//const fs = require('fs')
const app = express();
import bodyParser from 'body-parser';
// const { Http2ServerResponse } = require('http2');
import { Http2ServerRequest } from 'http2';
const port = 3000
const quotesPath = '../NodeMongo-MS-QuoteMachine/Repository/MS-Quotes.json';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
import { getClient, addQuote } from '../DbAccess/DbQuotes.js';
app.get('/ping', (req, res) => {
    res.send("pong");
})

app.get('/quotes', (req, res) => {
    console.log("hitting quotes");
    const quotes = fs.readFileSync(quotesPath);
    var json = JSON.parse(quotes);
    res.status(202).send(json);
});

app.post('/quote', (req, res) => {
    const quote = req.body;
    addQuote(quote);
    return res.status(202).send({ message: `Quote ${JSON.stringify(quote.quote)} added` });
});

app.listen(port, () => {
    console.log('MS-QuotesAPI listening at http://localhost:3000');
})