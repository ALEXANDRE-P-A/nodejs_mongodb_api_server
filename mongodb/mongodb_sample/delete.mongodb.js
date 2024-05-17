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

const deleteOneRecord = async _ => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const col = db.collection(COLLECTION);
    const result = await col.deleteOne({ content: "sample-data" });
    console.log(result);
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

const deleteManyRecords = async _ => {
  try {
    await client.connect();
    const db = client.db(DATABASE);
    const col = db.collection("todos");
    const result = await col.deleteMany({ editing: false });
    console.log(result);
  } catch(err) {
    console.error(err);
  } finally {
    await client.close();
  };
};

// deleteOneRecord();
// deleteManyRecords();