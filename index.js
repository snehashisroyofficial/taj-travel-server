const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.port || 5000;

//middle ware setup
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSK}@cluster0.8kmx02i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const countriesCollection = client
      .db("CountriesDB")
      .collection("countryName");
    const touristsSpotCollection = client
      .db("CountriesDB")
      .collection("touristsSpot");

    const clientReviewsCollection = client
      .db("clientReviews")
      .collection("reviews");
    //countries  post
    app.post("/country", async (req, res) => {
      const newCountry = req.body;
      const result = await countriesCollection.insertOne(newCountry);
      res.send(result);
    });

    app.get("/country", async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //touristsspot post

    //post data in database
    app.post("/touristsspot", async (req, res) => {
      const newSpot = req.body;
      const result = await touristsSpotCollection.insertOne(newSpot);
      res.send(result);
    });

    //get all the data in database
    app.get("/alltouristsspot", async (req, res) => {
      const cursor = touristsSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //find single data from database
    app.get("/viewdetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.findOne(query);
      res.send(result);
    });

    //delete data from database
    app.delete("/touristsspot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const data = req.body;
      const updatedData = {
        $set: {
          average_cost: data.average_cost,
          country_name: data.country_name,
          description: data.description,
          image_url: data.image_url,
          location: data.location,
          options: data.options,
          total_visitors_per_year: data.total_visitors_per_year,
          tourists_spot_name: data.tourists_spot_name,
          travel_time: data.travel_time,
        },
      };
      const result = await touristsSpotCollection.updateOne(
        query,
        updatedData,
        option
      );
      res.send(result);
    });

    //client review add

    app.post("/reviewadd", async (req, res) => {
      const newSpot = req.body;
      const result = await clientReviewsCollection.insertOne(newSpot);
      res.send(result);
    });

    app.get("/reviewadd", async (req, res) => {
      const cursor = clientReviewsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("coffee maker server is running");
});

app.listen(port, () => {
  console.log(`This port is running on ${port}`);
});
