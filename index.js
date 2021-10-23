const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const { query } = require("express");
const app = express();
const port = 5000;

// middleqWare
app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://mydatabase1:rlRnkNXYAr1uMQlR@cluster0.pqjxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("foodmaster");
    const usersCollection = database.collection("users");
    // get api
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    //1st part for update api
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);
      console.log("load user id:", id);
      res.send(user);
    });
    // post api
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      console.log("got new user", req.body);
      console.log("hitting the api", req.body);
      res.json(result);
    });
    // Update API
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating user", id);
      res.send(result);
    });
    // delete api
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(qurey);
      console.log("deleting user with id", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my CRUD server");
});

app.listen(port, () => {
  console.log("Running Server on port", port);
});
