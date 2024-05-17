const { CONNECT_URL, DATABASE, TODO_COLLECTION } = require("../config/mongodb.config.js");

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = CONNECT_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const todoProvider = async _ => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const docs = await db.collection("todos").find().toArray();
    return docs;
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

module.exports = todoProvider;