const { CONNECT_URL, DATABASE, COLLECTION } = require("../../config/mongodb.config.js");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = CONNECT_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const updateOneRecord = async _ => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const col = db.collection(COLLECTION);
    const result = await col.updateOne({ content: "sample-data" }, { $set: { editing: true } });
    console.log(result);
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

const updateManyRecords = async _ => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const col = db.collection("todos");
    const result = await col.updateMany({ editing: true }, { $set: { editing: false } });
    console.log(result);
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

// updateOneRecord();
updateManyRecords();