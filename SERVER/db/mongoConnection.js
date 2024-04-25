require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongo() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client; // Return the connected client
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
}

module.exports = { connectToMongo };
