const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json())


// const uri = "mongodb+srv://<username>:<password>@cluster0.wvig2d6.mongodb.net/?retryWrites=true&w=majority"; 
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-hzckllx-shard-00-00.wvig2d6.mongodb.net:27017,ac-hzckllx-shard-00-01.wvig2d6.mongodb.net:27017,ac-hzckllx-shard-00-02.wvig2d6.mongodb.net:27017/?ssl=true&replicaSet=atlas-sxh7jl-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();
    
    const serviceCollection = client.db("AquaLeapToy").collection("toyCollection")
    // const bookingCollection = client.db("AquaLeapToy").collection("bookings")    



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
  
  }
}
run().catch(console.dir);

app.get("/",(req,res)=>{
  res.send("Toy Market Server is running")
})


app.listen(port,()=>{
  console.log("Toy Market is running on " + port);  
})
