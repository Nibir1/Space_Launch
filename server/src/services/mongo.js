const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

// Get the MONGO_URL from the .env file
const MONGO_URL = process.env.MONGO_URL;

// Connection event listeners for logging
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

// Asynchronous function to connect to MongoDB
async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

// Asynchronous function to disconnect from MongoDB
async function mongoDisconnect() {
  await mongoose.disconnect();
}

// Export the connection and disconnection functions
module.exports = {
  mongoConnect,
  mongoDisconnect,
};
