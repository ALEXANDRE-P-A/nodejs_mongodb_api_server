const { CONNECT_URL, DATABASE } = require("../../config/mongodb.config.js");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = CONNECT_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const pingMongoDB = async _ => {
  try {
    await client.connect();
    await client.db(DATABASE).command({ ping: 1 });
    console.log("Server successfully responded.");
  } catch(err) {
    console.log("Server failed to respond.");
    console.error(err);
  } finally {
    await client.close();
  };
}; 

pingMongoDB();