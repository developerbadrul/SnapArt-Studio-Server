const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_UserName}:${process.env.DB_PassWord}@cluster0.zyvfoih.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    // create new shop 
    app.post("/add-new-shop", async(req, res)=>{
        const shopList = client.db("operatorManager").collection("shopList");
        const newShop = req.body;
        const result = await shopList.insertOne(newShop)
        res.send(result)
    })

    // get all services 
    app.get("/services", async(req, res)=>{
      const allServices = client.db("operatorManager").collection("allServices");
      const result = await allServices.find().toArray()
      res.send(result)
    })
     
    // get single service 
    app.get("/services/:id", async(req, res)=>{
      const id = req.params.id;
      const allServices = client.db("operatorManager").collection("allServices")
      const query = {
        _id : new ObjectId(id)
      }
      const result = await allServices.findOne(query);
      res.send(result)
    })

    // create new Order 

    app.post("/orders", async(req, res)=>{
      const orderCollection = client.db("operatorManager").collection("orders")
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      // console.log(newOrder);
      res.send(result)
    })

    // get order by email address 

    app.get("/orders/:clientEmail", async(req, res)=>{
      const orderCollection = client.db("operatorManager").collection("orders");
      const clientEmail = req.params.clientEmail;
      const query ={
        ClientEmail: clientEmail
      }

      const result = await orderCollection.find(query).toArray()
      res.send(result)

    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



try {
    app.get("/", (req, res)=>{
        res.send("Server Running")
    })

    app.listen(port, ()=>{
        console.log(`sarver is running port ${port}`);
    })
} catch (error) {
    console.log(error);
}



