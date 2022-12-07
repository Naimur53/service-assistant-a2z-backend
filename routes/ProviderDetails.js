const express = require('express')
const router = express.Router();
const admin = require("firebase-admin");
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

let token;


const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const database = client.db("service-assistant");
const providerDetaisls = database.collection('provider-details');

client.connect()

router.post('/', async (req, res) => {
    res.send(await providerDetaisls.insertOne(req.body));
});

router.get('/', async (req, res) => {
    res.send(await providerDetaisls.find({}).toArray());
});

router.get('/provider', async (req, res) => {
    const email = req.query.email;
    console.log(email);
    const query = { email: email };
    res.send(await providerDetaisls.findOne(query));
});

router.get('/provider/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    res.send(await providerDetaisls.findOne(query));
});

// add offerservice 
router.post('/addservice/:email', async (req, res) => {
    const email = req.params.email;
    console.log(email);
    const query = { email: email };
    const result = await providerDetaisls.updateOne(query, { $push: { offerService: req.body } });
    res.send(result);
});


// add review
router.post('/addreview', async (req, res) => {
    const email = req.query.email;
    console.log(email)
    const query = { email: email };
    res.send(await providerDetaisls.updateOne(query, { $push: { 'reviews': req.body } }))
});


// update provider details
router.put('/updateName/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const updateDoc = { $set: { ShopName: req.body.ShopName } };
    res.send(await providerDetaisls.updateOne(query, updateDoc));
});
router.put('/updateBio/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const updateDoc = { $set: { bio: req.body.bio } };
    res.send(await providerDetaisls.updateOne(query, updateDoc));
});
router.put('/updateAddress/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const updateDoc = { $set: { address: req.body.address } };
    res.send(await providerDetaisls.updateOne(query, updateDoc));
});

router.put('/updateAboutus/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const updateDoc = { $set: { about: req.body.about } };
    res.send(await providerDetaisls.updateOne(query, updateDoc));
});

router.put('/updateBackgroundimage/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const updateDoc = { $set: { backgroundImage: req.body.backgroundImage } };
    res.send(await providerDetaisls.updateOne(query, updateDoc));
});

router.put('/updateLogo/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const updateDoc = { $set: { Logo: req.body.Logo } };
    res.send(await providerDetaisls.updateOne(query, updateDoc));
});

module.exports = router;