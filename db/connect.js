const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { MongoClient } = require("mongodb");
const data = require("./../data/serviceDetails");
const category = require("./../data/category");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

const uri = process.env.MONGO_CONNECTION;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected and working...");
    const database = client.db("service-assistant");
    const ServicesCollection = database.collection("Services");
    const allServicesCollection = database.collection("SingleServicesDetails");
    const orderCollection = database.collection("Orders");
    // const allUsersCollection = database.collection("Users");
    // const orderCollection = database.collection("Orders");

    // delete order collection
    app.delete("/delete-orderCollection", async (req, res) => {
      try {
        const res = await orderCollection.deleteMany({});
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    });

    app.post("/insert-category", async (req, res) => {
      try {
        const res = await ServicesCollection.insertMany(category);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    });

    app.post("/insert-serviceDetails", async (req, res) => {
      try {
        const res = await allServicesCollection.insertMany(data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    });

    app.delete("/delete-serviceCategory", async (req, res) => {
      try {
        const res = await ServicesCollection.deleteMany({});
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    });

    app.delete("/delete-singleServiceDetails", async (req, res) => {
      try {
        const res = await allServicesCollection.deleteMany({});
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

run().catch();

app.listen(port, () => {
  console.log(" This server is running at port sagar", port);
});
