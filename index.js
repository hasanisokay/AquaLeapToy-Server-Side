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
    const toyCollection = client.db("AquaLeapToy").collection("toyCollection")   
    const result = await toyCollection.createIndex({toyName: 1})

    app.get("/myToys", async(req,res)=>{
        const email = req.query.email
        const query = {email: email}
        const result = await toyCollection.find(query).toArray()
        res.send(result)
        
    })

    app.get("/allToys",async(req,res)=>{
      const result = await toyCollection.find().toArray()
      res.send(result) 
    })

    // get number of total toys 
    app.get("/totalToys", async(req,res)=>{
      const result = await toyCollection.estimatedDocumentCount();
      res.send({result})
    })

    // get limited toy for pagination
    app.get("/toys", async(req,res)=>{
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 20;
      const skip = page * limit;
      const result = await toyCollection.find().skip(skip).limit(limit).toArray();
      res.send(result)
    })
    // getting search result
    app.get("/toys/:text", async(req,res)=>{
      const text = req.params.text;
      const query = {toyName: text}
      const result = await toyCollection.find({toyName: {$regex:text, $options: "i"}}).toArray()
      res.send(result)
    })
    app.patch("/updateToys/:id", async(req,res)=>{
      const id = req.params.id;
      const updatedToy = req.body;
      const filter = {_id: new ObjectId(id)}
      const updatedDoc ={
        $set:{
          toyName:updatedToy.toyName, 
          photoURL:updatedToy.photoURL, 
          sellerName:updatedToy.sellerName, 
          price:updatedToy.price, 
          rating:updatedToy.rating, 
          quantity:updatedToy.quantity, 
          description:updatedToy.description, 
          category:updatedToy.category
        }
      }
      const result = await toyCollection.updateOne(filter,updatedDoc)
      res.send(result)
    })

    // delete single toy
    app.delete("/myToys/:id",async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })
    
    
    
    // adding toys to db
    app.post("/addAToy",async(req,res)=>{
        const toy = req.body;
        const result = await toyCollection.insertOne(toy);
        res.send(result)
    })




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
