var express = require('express')
var router = express.Router()

const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("service-assistant");
const allUsersCollection = database.collection('Users')
const allServicesCollection = database.collection('SingleServicesDetails')
const allOrdersCollection = database.collection('Orders')
client.connect()
router.get("/allProvider", async (req, res) => {
    const query = {
        role: 'provider'
    }
    const cursor = await allUsersCollection.find(query);
    const users = (await cursor.toArray()).reverse();
    res.json(users);
});
router.get("/:email", async (req, res) => {
    const email = req.params.email;
    console.log(email);
    const query = {
        role: 'provider',
        email
    }
    const cursor = await allUsersCollection.findOne(query);
    res.json(cursor);
});
router.get("/getWithId/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
        _id: ObjectId(id),
        role: 'provider',
    }
    console.log(query);
    const cursor = await allUsersCollection.findOne(query);
    if (!cursor) {
        res.json({ error: 'user is not a provider' })
    }
    else {
        res.json(cursor);
    }
});
router.get("/myServices/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
        serviceProvider: { $in: [id] }
    }
    const cursor = await allServicesCollection.find(query);
    const result = await cursor.toArray();
    res.json(result);
});
router.get("/appointment/:email", async (req, res) => {
    const email = req.params.email;
    const query = {
        "providerEmail": email
    }
    const cursor = await allOrdersCollection.find(query);
    const result = await cursor.toArray();
    console.log(query, result);
    res.json(result);
});
router.get("/:status/appointment/:email", async (req, res) => {
    const email = req.params.email;
    const status = req.params.status;
    const query = {
        "providerEmail": email,
        status,
    }
    const cursor = await allOrdersCollection.find(query);
    const result = await cursor.toArray();
    console.log(query, result);
    res.json(result);
});


module.exports = router