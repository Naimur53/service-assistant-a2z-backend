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
const allAddQuestionsCollection = database.collection("addQuestions");

client.connect();

//Get All Banner 
router.get("/", async (req, res) => {
  const cursor = allAddQuestionsCollection.find({});
  const result = (await cursor.toArray()).reverse();

  res.json(result);
});
// post method 
router.post("/", async (req, res) => {
    const questions = { ...req.body };
    console.log(questions);
    const result = await allAddQuestionsCollection.insertOne(questions);
    console.log("saved questions successfull", result)
    res.json(result);
  });
//   delete api ... .. .. 
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    res.send(await allAddQuestionsCollection.deleteOne(query));
});
router.put('/:id', async(req, res) =>{
    const id = req.params.id
    console.log("updating data ", id)
    console.log(req.body)
    
    const filter = { _id:ObjectId(id) };

  
    const updateDoc = {
      $set: {
       question:req.body.question,
       answer:req.body.answer
      },
    };
    const result = await allAddQuestionsCollection.updateOne(filter, updateDoc);
    res.send(result);
})



module.exports = router;

