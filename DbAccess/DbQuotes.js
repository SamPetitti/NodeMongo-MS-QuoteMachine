//const { MongoClient } = require('mongodb');
import { default as mongodb } from 'mongodb';
//require("dotenv").config();
import dotenv from 'dotenv';
dotenv.config();
const db = "ms_quote_machine";
const collection = "quotes";
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sp-training.uoozx.mongodb.net/?retryWrites=true&w=majority`;
async function main() {

    const client = new mongodb.MongoClient(uri);

    try {
        await client.connect();
        // await createListing(client, {
        //     name: "Lovely Loft",
        //     summary: "A charming loft in Paris",
        //     bedrooms: 1,
        //     bathrooms: 6
        // });

        // await createMultipleListings(client, [
        //     {
        //         name: "Nyc Loft",
        //         summary: "A loft in Nyc",
        //         bedrooms: 4,
        //         bathrooms: 1
        //     },
        //     {
        //         name: "Cleveland Loft",
        //         summary: "A loft in the land",
        //         bedrooms: 4,
        //         bathrooms:4543
        //     }
        // ]);
        //await findListingByName(client, "Cleveland Loft");

        //await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, { minimumNumberOfBedrooms: 3, minimumNumberOfBedrooms: 2, maximumNumberOfResults: 5 });

        // await updateListingByName(client, "Cleveland Loft", {
        //     name: "Cleveland Loft",
        //     summary: "A loft in the land",
        //     bedrooms: 66,
        //     bathrooms: 4543
        // });
        // await upsertListingByName(client, "Simsbury Home", {
        //     name: "Simsbury Home",
        //     summary: "A home in CT",
        //     bedrooms: 3,
        //     bathrooms: 2
        // });
        // await updateAllListingsToIncludePropertyType(client);
        // //await addQuote(client, {
        //     quote: "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me."
        // });
        //await listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}

//*******run program 
main().catch(console.error);

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
async function createMultipleListings(client, newListings) {
    const result = await client.db("sample_airbnb")
        .collection("listingsAndReviews")
        .insertMany(newListings);
    console.log("New listing with the following id: " + result.insertedId);
    console.log(`${result.insertedCount} new Listings with the following Id(s): `);
    console.log(result.insertedIds);
}


async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
        .insertOne(newListing);

}


//**********read
async function findListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
        .findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}'`);
        console.log(result);
    } else {
        console.log(`Could not find any results`);
    }
}

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(
    client, {
        minimumNumberOfBedrooms = 0,
        minimumNumberOfBathrooms = 0,
        maximumNumberOfResults = Number.MAX_SAFE_INTEGER
    } = {}) {
    const cursor = await client.db(db).collection(collection).find({
        bedrooms: { $gte: minimumNumberOfBedrooms },
        bathrooms: { $gte: minimumNumberOfBathrooms }
    }).sort({ last_review: -1 })
        .limit(maximumNumberOfResults);

    const result = await cursor.toArray();
    console.log(result);
}

//****update */

async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb")
        .collection("listingsAndReviews")
        .updateOne({ name: nameOfListing }, { $set: updatedListing }, { upsert: true });
    console.log(`${result.matchedCount} matched documents`);
    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated`);
    }

}

const updateListingByName = async (client, nameOfListing, updatedListing) => {
    const result = await client.db("sample_airbnb")
        .collection("listingsAndReviews")
        .updateOne({ name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} matched documents`);
    console.log(result);
}

const updateAllListingsToIncludePropertyType = async (client) => {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({
        property_type: { $exists: false }
    },
        {
            $set: { property_type: "Unknown" }
        });

    console.log(`${result.matchedCount} document(s) matched the result criteria`);
    console.log(`${result.modifiedCount} document(s) was/were modified`);
}

//******DELETE */




async function listDatabases(client) {
    const dbList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    dbList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    });
}