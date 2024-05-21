require("dotenv").config();

module.exports = {
  CONNECT_URL: process.env.MONGODB_ENV === "development" 
    ? process.env.MONGODB_LOCAL_URL : process.env.MONGODB_GLOBAL_URL,
  DATABASE: "nodejs_mongodb_api_server",
  TODO_COLLECTION: "todos",
  COLLECTION: "sample_collection"
};