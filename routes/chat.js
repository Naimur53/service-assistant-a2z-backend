var express = require('express')
var router = express.Router()

const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("service-assistant");
const chatCollection = database.collection('Chat')

client.connect()
router.post('/', async (req, res) => {
    console.log(req.body, 'going to save');
    const data = req.body;
    const cursor = await chatCollection.insertOne(data)
    res.json(cursor);
})
router.get("/", async (req, res) => {
    const cursor = await chatCollection.find({ type: 'text' });
    const result = await cursor.toArray()
    res.json(result);
});
router.get("/provider/:email", async (req, res) => {
    const email = req.params.email;
    const query = {
        provider: email
    }
    const cursor = await chatCollection.find(query);
    const result = await cursor.toArray()
    res.json(result);
});
router.get("/singleOrder/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
        id
    }
    const cursor = await chatCollection.find(query);
    const result = await cursor.toArray()
    res.json(result);
});
router.get("/:uid", async (req, res) => {
    const uid = req.params.uid
        ;
    const query = {
        uid
    }
    console.log(query);
    const cursor = await chatCollection.find(query);
    const result = await cursor.toArray()
    res.json(result);

});


module.exports = router