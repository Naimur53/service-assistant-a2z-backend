var express = require("express");
const ObjectId = require("mongodb").ObjectId;
var router = express.Router();

const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_CONNECTION;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = client.db("service-assistant");
const allServicesCollection = database.collection("SingleServicesDetails");

client.connect();
// All single services
router.get("/", async (req, res) => {
  const cursor = allServicesCollection.find({ pendingStatus: { $ne: true } });
  const services = await cursor.toArray();

  res.json(services);
});
router.get("/count", async (req, res) => {
  const cursor = await allServicesCollection
    .find({ penfingStatus: { $ne: true } })
    .count();
  res.json({ count: cursor });
});
// with specific id for unique
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  let cursor;
  if (id.length === 24) {
    cursor = await allServicesCollection.findOne({ _id: ObjectId(id) });
    console.log(cursor);

  }
  else {
    cursor = {};
  }

  res.json(cursor);
});

// delete a cetain single service details - by sagar
router.delete("service/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  console.log(query);
  const cursor = await allServicesCollection.deleteOne(query);
  console.log(cursor);

  res.json(cursor);
});
router.put("/trending/:id", async (req, res) => {
  const parentService = parseInt(req.params.id);
  const filter = { parentService };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      trending: "trending",
    },
  };
  const data = await allServicesCollection.updateOne(filter, updateDoc, options);
  res.json(data);
});
router.put("/:id", async (req, res) => {
  const parentService = parseInt(req.params.id);
  const filter = { parentService };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      serviceProvider: ["62121eb1cef8c7b4915a6923", "6211cbf6bb809e9e3edb1859"],
    },
  };
  const data = await allServicesCollection.updateOne(filter, updateDoc, options);
  res.json(data);
});
router.post("/", async (req, res) => {
  const result = await allServicesCollection.insertOne({ ...req.body });
  res.json(result);
});

router.get("/service/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  res.json(await allServicesCollection.findOne(query));
});

// post review ...  .. 
router.post("/addreview/:parentId", async (req, res) => {
  const parentId = parseInt(req.params.parentId);
  const query = { parentService: parentId };
  const service = await allServicesCollection.updateOne(query, {
    $push: { Reviews: req.body },
  });

  res.send(service);
});

  // allServicesCollection.update(query, { $push: { reviews: req.body } })
  // let xz = service.Reviews;
  // const insertReivew = await allServicesCollection.update(query, { $push: { 'Reviews': req.body } });
  // res.send(insertReivew)zs ........

// update review 
router.put('/updatereview/:uid', async (req, res) => {
  const uid = req.params.uid;
  const query = { 'Reviews.serviceId': req.body.serviceId };
  const service = await allServicesCollection.updateOne(query, { $set: { 'Reviews.$': { ...req.body, id: uid, date: new Date() } } })
  // res.status(200)
  res.send(service);
  // console.log(parentId, uid);
  // const query = { parentService: parentId };
  // const filter = { Reviews: { id: uid } }
  // console.log(service);
  // const filter = { Reviews: { id: uid } };
  // const updateDoc = { $set: { name: req.body.name } }
  // const service = await allServicesCollection.find(filter, filter);
  // const reviews = await service?.Reviews?.findOne(filter);
  // console.log(reviews);
  // console.log(service?.Reviews?.findOne({ id: uid }));
  // const updateReivew = await service?.Reviews?.updateOne(filter, { $set: { name: '2022' } })
  // console.log(service.Reviews.findOne(filter));
  // ?.Reviews?.updateOne(filter, updateDoc)
  // const updateReview = await allServicesCollection?.Reviews?.updateOne(filter, updateDoc)
  // console.log(service.Reviews); //.. .. .. .. ..
});

// delete review
router.delete('/deleteReview', async (req, res) => {
  const uid = req.query.uid;
  const parentId = parseInt(req.query.parentId);
  const query = { 'Reviews.id': uid };
  const review = await allServicesCollection.updateOne(query, { '$pull': { 'Reviews': { id: uid } } })
  res.send(review);
});

module.exports = router;
