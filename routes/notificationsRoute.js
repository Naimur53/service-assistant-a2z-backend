var express = require('express')
var router = express.Router()

const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("service-assistant");
const allNotificationsCollection = database.collection('Notifications')

client.connect()


router.get("/", async (req, res) => {
  const cursor = allNotificationsCollection.find({});
  const services = await cursor.toArray();
  res.json(services);
});

router.get("/getnotification", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const result = await allNotificationsCollection.find(query).toArray();
  res.send(result);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const result = await allNotificationsCollection.insertOne({ ...req.body });
  res.json({ ...req.body });
});

router.put('/statuschange/:email', async (req, res) => {
  const useremail = req.params.email;
  const query = { email: useremail };
  const updateDoc = { $set: { seen: true } };
  res.send(await allNotificationsCollection.updateMany(query, updateDoc));
});

module.exports = router
