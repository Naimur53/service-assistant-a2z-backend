var express = require('express')
var router = express.Router();
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectId;


const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("service-assistant");
const allUsersReviewCollection = database.collection('Reviews')

client.connect()

router.get("/", async (req, res) => {
  const cursor = allUsersReviewCollection.find({});
  const services = await cursor.toArray();

  res.json(services);
});
router.post("/", async (req, res) => {

  const result = await allUsersReviewCollection.insertOne({ ...req.body });
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  res.send(await allUsersReviewCollection.deleteOne(query));
})

router.put('/:reviewId', async (req, res) => {
  const id = req.params.reviewId;
  const filter = { _id: ObjectId(id) };
  const result = await allUsersReviewCollection.updateOne(filter, {
    $set: { status: 'approved' }
  })



})


module.exports = router