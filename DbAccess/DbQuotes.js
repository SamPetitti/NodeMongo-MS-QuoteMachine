import { default as mongodb } from 'mongodb';
import dotenv, { config } from 'dotenv';
dotenv.config();
const db = "ms_quote_machine";
const collection = "quotes";
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sp-training.uoozx.mongodb.net/?retryWrites=true&w=majority`;

//*******run program 
//main().catch(console.error);

//**client */
export async function getClient() {
    return new mongodb.MongoClient(uri);
}

//*********add quote
export async function addQuote(quote) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    const result = await client.db(db).collection(collection)
        .insertOne(quote);
    console.log(result);
    client.close;
}


export async function getQuotes() {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    const result = await client.db(db).collection(collection)
        .aggregate([{
            $project: {
                _id:"$_id",
                quote:"$quote",
                totalvotes: {$size:"$ratings"},
                rating:{$round : [{$avg: "$ratings"}, 2]}
            }
        }]).toArray();
    client.close();
    return result;
}

export async function addRatingToQuote(id, rating) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    const objectId = new mongodb.ObjectId(id);
    const result = await client.db(db).collection(collection)
        .updateOne({ _id: objectId }, { $push: { ratings: rating } });
    console.log(`${result.modifiedCount} for id quote updated`)
    console.log(result);
}



async function listDatabases(client) {
    const dbList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    dbList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    });
}