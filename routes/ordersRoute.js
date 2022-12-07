const express = require('express')
var router = express.Router()
const ObjectId = require('mongodb').ObjectId;
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("service-assistant");
const allOrdersCollection = database.collection('Orders')

client.connect()

router.get("/", async (req, res) => {
  const cursor = allOrdersCollection.find({});
  const services = await cursor.toArray();
  res.json(services);

});
router.get("/:id", async (req, res) => {
  const id = req.params.id
  const query = { _id: ObjectId(id) }
  console.log(query);
  const cursor = await allOrdersCollection.findOne(query);
  res.json(cursor);

});
router.get("/all/pending", async (req, res) => {
  const cursor = allOrdersCollection.find({ status: 'pending' });
  const services = await cursor.toArray();
  res.json(services);

});

router.put('/changestatus/:id', async (req, res) => {
  // const id = req.params.id;
  // // const status = req.body;
  // console.log(id);
  // const options = { upsert: true }
  // const query = { _id: id };
  // console.log(req.body.status);
  // const updateDoc = { $set: { status: 'approved' } };
  // res.send(await allOrdersCollection.updateOne(query, updateDoc));

  const id = req.params.id;
  console.log(id, 'dfodfjd');
  const updatateUser = req.body;

  console.log(req.body.updateStatus);

  const filter = { _id: ObjectId(id) };
  // const options = { upsert: true }
  const updateDoc = {
    $set: {
      status: req.body.updateStatus
    },
  };
  const result = await allOrdersCollection.updateOne(filter, updateDoc)
  res.send(result);
})

// router.get("/last7days", async (req, res) => {
//   let lastWeek = new Date();
//   lastWeek.setDate(lastWeek.getDate() - 8);
//   console.log(new Date(lastWeek).toDateString());
//   const query = {
//     date: { $gte: lastWeek }
//   }
//   const cursor = allOrdersCollection.find(query);
//   const result = await cursor.toArray();
//   res.json(result);
// });

router.post("/", async (req, res) => {

  const result = await allOrdersCollection.insertOne({ ...req.body });
  res.json(result);
});

module.exports = router;