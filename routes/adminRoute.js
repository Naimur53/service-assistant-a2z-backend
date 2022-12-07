var express = require('express')
var router = express.Router()

const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_CONNECTION
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("service-assistant");
const allUsersCollection = database.collection('Users')

client.connect()

router.put('/makeadmin/:email', async (req, res) => {
  const filter = { email: req.params.email };
  console.log("put", filter)
  const options = { upsert: false };
  const updateDoc = {
    $set: {
      role: req.body.role
    },
  };
  const result = await allUsersCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});
// check admin
router.get('/checkadmin/:email', async (req, res) => {
  const result = await allUsersCollection.findOne({ email: req.params.email });
  let role = 'user'
  if (!result?.role) {
    role = 'user'
  }
  else {
    role = result.role
  }
  res.send({ role });
});
module.exports = router