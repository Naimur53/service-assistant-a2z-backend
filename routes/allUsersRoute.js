var express = require('express')
var router = express.Router()

const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require("express-fileupload");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("service-assistant");
const allUsersCollection = database.collection('Users')

client.connect()
router.get("/allusers", async (req, res) => {
  // const cursor = advocatesCollection.find({});
  const cursor = allUsersCollection.find({});
  const users = (await cursor.toArray()).reverse();

  res.json(users);
});
// update user info 


router.put("/updateinfo/:email", upload.single("image"), async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "images");
  console.log(req.params.email)
  console.log(req.file)
  const newPath = await uploader(req.file.path);
  fs.unlinkSync(req.file.path);
  console.log(req.body);
  const email = req.params.email
  const filter = { email };

  const textArea = req.body.textArea;
  const serviceName = req.body.serviceName;
  const options = { upsert: true };

  const updateDoc = {
    $set: {
      serviceName,
      textArea,
      image: newPath.url,
    },
  };
  const result = await allUsersCollection.updateOne(filter, updateDoc, options);
  // const result = await allUsersCollection.findOne(filter);
  res.json(result);
});
// getting all the user whoose role is provider 
router.get("/providers", async (req, res) => {
  // const cursor = advocatesCollection.find({});
  const cursor = allUsersCollection.find({ role: "provider" });
  const users = (await cursor.toArray()).reverse();

  res.json(users);
});
router.get("/providers/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  res.send(await allUsersCollection.findOne(query));

});
router.get("/:email", async (req, res) => {
  const query = req.params.email
  const allUser = await allUsersCollection.findOne({ email: query });
  res.json(allUser);
});
router.post("/register", async (req, res) => {
  const user = { ...req.body, role: "user" };
  console.log(user);
  const result = await allUsersCollection.insertOne(user);
  console.log("registration successfull", result)
  res.json(result);
});
// save user google sign
router.put('/register', async (req, res) => {
  const user = req.body;
  const filter = { email: user.email };
  const options = { upsert: true };
  const updateDoc = { $set: user };
  const result = await allUsersCollection.updateOne(filter, updateDoc, options);
  res.json(result);
});

router.get('/finding/ids', async (req, res) => {
  let allIds = req.query?.data;
  console.log(allIds);
  let objId = [];
  if (allIds?.length) {
    allIds.forEach(element => objId.push(ObjectId(element)))
  }
  const query = {
    _id: { $in: objId }
  }
  const cursor = allUsersCollection.find(query);
  const users = await cursor.toArray();
  res.json(users);
})


module.exports = router;