import express from 'express';
const app = express();
import bodyParser from 'body-parser';
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
import { getQuotes, addQuote, addRatingToQuote } from '../DbAccess/DbQuotes.js';
app.get('/ping', (req, res) => {
    res.send("pong");
})

app.get('/quotes', async (req, res) => {
    console.log("hitting quotes");
    const quotes = await getQuotes();
    console.log(quotes);
    // const quotesJson = JSON.parse(quotes);
    res.status(200).send(quotes);
});

app.post('/quote', (req, res) => {
    const quote = req.body;
    addQuote(quote);
    return res.status(202).send({ message: `Quote ${JSON.stringify(quote.quote)} added` });
});

app.put('/quote', async (req, res) => {
    const quote = req.body;
    addRatingToQuote(quote._id, quote.rating);
    res.status(204).send({ message: `Quote ${JSON.stringify(quote.quote)} added` });
});



app.listen(port, () => {
    console.log('MS-QuotesAPI listening at http://localhost:3000');
})