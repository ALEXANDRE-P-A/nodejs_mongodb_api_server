const { CONNECT_URL, DATABASE, COLLECTION } = require("../../config/mongodb.config.js");
const docArray = require("./docInit.js");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = CONNECT_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const insertOneRecord = async _ => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const col = db.collection(COLLECTION);
    const result = await col.insertOne({
      id: 1,
      content: "sample-data",
      date: new Date(),
      editing: false
    });
    console.log(result);
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

const insertManyRecords = async _ => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const col = db.collection("todos");
    const result = await col.insertMany(docArray);
    console.log(result);
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

// insertOneRecord();
// insertManyRecords();