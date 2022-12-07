var express = require('express')
var router = express.Router();
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectId;


const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("service-assistant");
const providerCollection = database.collection('providers');
const allServicesCollection = database.collection('SingleServicesDetails');
const allUsersCollection = database.collection('Users');

client.connect();

router.post('/', async (req, res) => {
    res.send(await providerCollection.insertOne(req.body));
});

router.get('/', async (req, res) => {
    res.send(await providerCollection.find({}).toArray());
});

router.put('/approveprovider', async (req, res) => {
    const uid = req.query.uid;
    console.log(uid);
    const query = { uid: uid };
    res.send(await allUsersCollection.updateOne(query, { $set: { role: 'provider' } }))
});


// router.post('/addreview/:parentId', async (req, res) => {
//   const parentId = parseInt(req.params.parentId)
//   const query = { parentService: parentId };
//   const service = await allServicesCollection.updateOne(query, { $push: { Reviews: req.body } })

//   res.send(service)

// console.log(service.Reviews);
// allServicesCollection.update(query, { $push: { reviews: req.body } })
// let xz = service.Reviews;
// const insertReivew = await allServicesCollection.update(query, { $push: { 'Reviews': req.body } });
// res.send(insertReivew)zs
// console.log(filter);

// })

router.delete('/deleteprovider/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    res.send(await providerCollection.deleteOne(query));
});

router.post('/addproviderkey/:parentid', async (req, res) => {
    const parentId = parseInt(req.params.parentid);
    const providers = req.body?.key;
    // console.log(providers.key, parentId);
    const query = { parentService: parentId };
    const result = await allServicesCollection.updateOne(query, { $push: { serviceProvider: providers } });
    res.send(result);
});





module.exports = router;