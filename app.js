require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://nodejs-mongodb-api-server-26f5f136cf92.herokuapp.com",
    // origin: "*",
    methods: [ "GET", "POST" ]
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "build")));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://nodejs-mongodb-api-server-26f5f136cf92.herokuapp.com');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, PATCH, DELETE, OPTIONS');
    next();
});

/* ----- Make MongoDB Connection ... (starts here) ----- */
const { CONNECT_URL, DATABASE, TODO_COLLECTION } = require("./config/mongodb.config.js");

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = CONNECT_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const connectMongoDB = async _ => {
  try {
    await client.connect();
  } catch(err) {
    console.error(err);
    await client.close();
  }
};

connectMongoDB();
/* ----- Make MongoDB Connection ... (ends here) ----- */

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

app.get("/todos", async (req, res) => {
  try {
    const db = client.db(DATABASE);
    const docs = await db.collection("todos").find().toArray();
    res.json(docs);
  } catch(err) {
    console.error(err);
  };
});

app.post("/todos", async (req, res) => {
  const newTodo = req.body;
  try {
    const db = client.db(DATABASE);
    const col = db.collection(TODO_COLLECTION);
    await col.insertOne(newTodo);
    res.json(newTodo);
  } catch(err) {
    console.error(err);
  };
});

app.patch("/todos/:id", async (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = req.body;
  try {
    const db = client.db(DATABASE);
    const col = db.collection(TODO_COLLECTION);
    const result = await col.updateOne({ id: todoId }, { $set: {
      content: todo.content,
      editing: todo.editing
    } });
    const isSuccess = result.modifiedCount === 1 ? todo : "id not found.";
    res.json(isSuccess);
  } catch(err) {
    console.error(err);
  };
});

app.delete("/todos/:id", async (req, res) => {
  const deleteId = parseInt(req.params.id);
  try {
    const db = client.db(DATABASE);
    const col = db.collection(TODO_COLLECTION);
    const result = await col.deleteOne({ id: deleteId });
    res.json(result);
  } catch(err) {
    console.error(err);
  };
});

io.on("connection", socket => {

  socket.on("todo/add", msg => {
    io.emit("todo/add", msg);
  });

  socket.on("todo/update", msg => {
    io.emit("todo/update", msg);
  });

  socket.on("todo/delete", msg => {
    io.emit("todo/delete", msg);
  });
});

server.listen(PORT, _ => {
  console.log(`Application listening at http://127.0.0.1:${PORT}`);
});