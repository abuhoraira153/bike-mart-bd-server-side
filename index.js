const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_PASS}:${process.env.DB_USER}@cluster0.pardn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log('database connected')
      const database = client.db("bikeMart");
      const productsCollection = database.collection("products");

      const usersCollection = database.collection("users");


      // GET API
      app.get('/products',async(req,res)=>{
        const cursor = productsCollection.find({});
        const products = await cursor.limit(6).toArray()
        res.send(products)
      })

      // GET SINGLE PRODUCT
      app.get('/products/:id',async(req,res)=>{
        const id = req.params.id;
        console.log('getting service',id)
        const query ={_id: ObjectId(id)}
        const product = await productsCollection.findOne(query);
        res.json(product)
      })


      // POST API
      app.post('/products', async(req,res)=>{
        const product = req.body;
          console.log('hit the post api',product)
          const result = await productsCollection.insertOne(product);
          console.log(result)
          res.json(result)
          
      })

      app.post('/users',async(req,res)=>{
        const user = req.body;
        console.log("user",user)
        const result = await usersCollection.insertOne(user);
        console.log(result)
        res.json(result)
      })

      app.put('/users/admin', async(req,res)=>{
        const user = req.body;
        console.log('put',user)
        const filter = {email: user.email};
        const updateDoc = {$set: {role : 'admin'}};
        const result = await usersCollection.updateOne(filter,updateDoc);
        res.json(result)

      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running bike mart Server')
})

app.listen(port,()=>{
    console.log('Running bike mart Server on port',port)
})