var express = require('express')
var router = express.Router()
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

const fileUpload = require("express-fileupload");
const fs = require("fs");
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const multer = require('multer');

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectId();
const database = client.db("service-assistant");
const allServiceRequestCollection = database.collection('ServicesRequest')

client.connect()

router.get("/", async (req, res) => {
  const cursor = allServiceRequestCollection.find({});
  const services = await cursor.toArray();
  res.json(services);
});
// router.post("/", async (req, res) => {
//   const result = await allServiceRequestCollection.insertOne({ ...req.body , status:'pending'});
//   console.log(result)
//   res.json(result);
// });

// make a service request handler function and route - by sagar
router.post("/", async (req, res) => {});

// end of make a service request handler function and route - by sagar

router.patch("/", async (req, res) => {

    const { id, status } = req.body;
    const filter = { _id: ObjectId(id) };
    const option = { upsert: false };
    const updateDoc = {
      $set: {
        status,
      },
    };
    const result = await allServiceRequestCollection.updateOne(
      filter,
      updateDoc,
      option
    );
    res.json(result);

  });



module.exports = router
