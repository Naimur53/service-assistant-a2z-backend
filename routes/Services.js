var express = require('express')
var router = express.Router()

const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectId();
const database = client.db("service-assistant");
const allServicesCollection = database.collection('Services')

client.connect()

router.get("/", async (req, res) => {
  const cursor = allServicesCollection.find({});
  const services = await cursor.toArray();
  res.json(services);
});
router.post("/", async (req, res) => {
  const result = await allServicesCollection.insertOne({ ...req.body });
  res.json(result);
});
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  res.send(await allServicesCollection.deleteOne(query));
})


module.exports = router
