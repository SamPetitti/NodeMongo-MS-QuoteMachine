const express = require('express', 4.17)
const fs = require('fs')
const app = express()
const port = 3000

app.get('/ping', (req, res) => {
    res.send("pong");
})

app.get('/quotes', (req, res) => {
    console.log("hitting quotes");
    const quotes = fs.createReadStream('../NodeMongo-MS-QuoteMachine/Repository/MS-Quotes.json');
    quotes.pipe(res);
})

app.post('/quotes')

app.listen(port, () => {
    console.log('MS-QuotesAPI listening at http://localhost:3000');
})