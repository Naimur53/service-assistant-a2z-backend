var express = require("express");
var router = express.Router();
const ObjectId = require("mongodb").ObjectId;

const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_CONNECTION;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = client.db("service-assistant");
const allHeaderBannerCollection = database.collection("headerBanners");

client.connect();

//Get All Banner 
router.get("/", async (req, res) => {
  const cursor = allHeaderBannerCollection.find({});
  const result = await cursor.toArray();

  res.json(result);
});

router.put("/", async (req, res) => {
  const newBaner = req.body;
  const filter = { bannerNumber: newBaner.bannerNumber};
  const option = { upsert: true };
  console.log(filter);
  const doc = {
    $set: { imageUrl: newBaner.imageUrl, bannerText:newBaner.bannerText, bannerNumber:newBaner.bannerNumber,bannerTex2:newBaner.bannerTex2 }
  };
  console.log(doc);
  const result = await allHeaderBannerCollection.updateOne(filter, doc,option);
  res.json(result);
});

module.exports = router;

