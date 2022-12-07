const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const uri = process.env.MONGO_CONNECTION;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// ..
const database = client.db("service-assistant");
const orderCollection = database.collection('Orders');

client.connect();

router.post("/", async (req, res) => {
  const service = req.body;
  console.log(service);
  service.mainId = ObjectId(service.mainId);
  console.log(service);
  res.send(await orderCollection.insertOne(service));
});

router.get("/", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  res.send(await orderCollection.find(query).toArray());
});

router.post("/createpaymentstatus", async (req, res) => {
  const paymentInfo = req.body;
  const amount = paymentInfo.price * 100;
  const paymentIntent = await stripe.paymentIntents.create({
    currency: "usd",
    amount: amount,
    payment_method_types: ["card"],
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});

// router.put('/cartProducts/:email', async (req, res) => {
//     const email = req.params.email;
//     const payment = req.body;
//     const filter = { email: email };
//     const updateDoc = {
//         $set: {
//             payment: payment
//         }
//     };
//     const result = await orderCollection.updateMany(filter, updateDoc);
//     res.json(result);
// })

module.exports = router;
