const { CONNECT_URL, DATABASE, TODO_COLLECTION } = require("../config/mongodb.config.js");

const { MongoClient, SeverApiVersion, ServerApiVersion } = require("mongodb");
const uri = CONNECT_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const updateOneTodo = async (todoId, todo) => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const col = db.collection(TODO_COLLECTION);
    const result = await col.updateOne({ id: todoId }, { $set: {
      content: todo.content,
      editing: todo.editing
    } });
    return result.modifiedCount === 1 ? todo : "id not found.";
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

module.exports = updateOneTodo;