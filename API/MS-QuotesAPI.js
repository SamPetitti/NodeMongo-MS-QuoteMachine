const express = require('express', 4.17)
const fs = require('fs')
const app = express();
const bodyParser = require('body-parser');
const { Http2ServerResponse } = require('http2');
const port = 3000
const quotesPath = '../NodeMongo-MS-QuoteMachine/Repository/MS-Quotes.json';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const mongoClient = require('mongodb').MongoClient;

app.get('/ping', (req, res) => {
    res.send("pong");
})

app.get('/quotes', (req, res) => {
    console.log("hitting quotes");
    const quotes = fs.readFileSync(quotesPath);
    var json = JSON.parse(quotes);
    res.status(202).send(json);
});

app.post('/addQuote', (req, res) => {
    const quote = req.body;
    const jsonRaw = fs.readFileSync(quotesPath);
    const json = JSON.parse(jsonRaw);
    json.quotes.push(quote);
    fs.writeFileSync(quotesPath, JSON.stringify(json));
    return res.status(202).send({ message: `Quote ${JSON.stringify(quote.quote)} added` });
});

app.listen(port, () => {
    console.log('MS-QuotesAPI listening at http://localhost:3000');
})