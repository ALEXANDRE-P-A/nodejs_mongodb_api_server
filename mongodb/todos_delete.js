const { CONNECT_URL, DATABASE, TODO_COLLECTION } = require("../config/mongodb.config.js");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = CONNECT_URL;

const client = new MongoClient(uri, {
  ServerApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const deleteOneTodo = async todoId => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const col = db.collection(TODO_COLLECTION);
    const result = await col.deleteOne({ id: todoId });
    return result;
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

module.exports = deleteOneTodo;