// Import Mongoose for interacting with MongoDB
const mongoose = require("mongoose");

// Define the schema for Planet documents in the database
const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String, // Data type for keplerName: String
    required: true, // Makes keplerName a required field
  },
});

// Export the Planet model using the schema
module.exports = mongoose.model("Planet", planetSchema);
