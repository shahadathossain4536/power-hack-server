const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2imv4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // const database = client.db("prower-hack");
    // const movies = database.collection("billing-details");
    const billingCollection = client
      .db("prower-hack")
      .collection("billing-list");
    // billing-list-start
    app.get("/billing-list", async (req, res) => {
      const query = {};
      const billingData = await billingCollection.find().toArray();
      res.send(billingData);
    });
    // billing-list-end
    // billing-list-one-start
    app.get("/billing-list/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const billingData = await billingCollection.findOne(query);
      res.send(billingData);
    });
    // billing-list-one-end

    // add-billing-start
    app.post("/add-billing", async (req, res) => {
      const billingData = await billingCollection.insertOne(req.body);
      res.send(billingData);
    });
    // add-billing-end
    // add update start
    app.put("/update-billing/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      console.log(filter);
      const updateBillData = req.body;
      const updateDoc = {
        $set: updateBillData,
      };
      console.log(updateBillData);
      const result = await billingCollection.updateMany(filter, updateDoc);
      console.log(result);
      res.send(result);
    });
    // add update end
    // delete-billing start
    app.delete("/delete-billing/:id", async (req, res) => {
      //   const id = req.params.id;
      //   const filter = { _id: ObjectId(id) };
      const result = await billingCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
    // delete-billing end
    // billing-list-count-start
    app.get("/billing-list-count", async (req, res) => {
      const query = {};
      const cursor = billingCollection.find({});
      const count = await cursor.count();
      res.send({ count });
    });
    // billing-list-count-end
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.get("/", (req, res) => {
  res.send("Power Hack");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
