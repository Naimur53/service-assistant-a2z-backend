const express = require('express')
const router = express.Router();
const admin = require("firebase-admin");
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
let token;

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const database = client.db("service-assistant");
const saveServiceCollection = database.collection('saveService');
const orderCollection = database.collection('Orders');

client.connect()

router.post('/', async (req, res) => {
    res.send(await saveServiceCollection.insertOne(req.body));
});

const serviceAccount = require('../service-assistant-a2z-firebase-adminsdk-8b8yg-737eb755be.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


async function verifyToken(req, res, next) {
    // console.log(object);
    // console.log(req.body);
    if (token) {
        // console.log(req.headers?.authorization);
        const idToken = token;
        try {
            const decoderUser = await admin.auth().verifyIdToken(idToken);
            req.decodeUserEmail = decoderUser.email;
        } catch {
            console.log("token not found")
        }

    }
    next();
}

router.get('/', verifyToken, async (req, res) => {
    const email = req.query.email;

    if (req.decodeUserEmail === email) {
        console.log(email);
        // let query = {};
        const query = { email: email }
        res.json(await saveServiceCollection.find(query).toArray());
    } else {
        res.status(401).json([]);
    }
    // const query = { email: email }
    // res.json(await saveServiceCollection.find(query).toArray());
});

router.post('/jwttoken', async (req, res) => {
    // const email = req.params.email;
    token = Object.keys(req.body)[0]
    // console.log(token);
    res.status(200)
});


// post save service on orders collection
router.post('/addonorderscollection', async (req, res) => {
    console.log(req.body);
    res.send(await orderCollection.insertMany(req.body));
});

module.exports = router;