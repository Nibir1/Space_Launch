// Import Mongoose for interacting with MongoDB
const mongoose = require("mongoose");

// Define the schema for Launch documents in the database
const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number, // Data type for flightNumber: Number
    required: true, // Makes flightNumber a required field
  },
  mission: {
    type: String, // Data type for mission: String
    required: true, // Makes mission a required field
  },
  rocket: {
    type: String, // Data type for rocket: String
    required: true, // Makes rocket a required field
  },
  launchDate: {
    type: Date, // Data type for launchDate: Date
    required: true, // Makes launchDate a required field
  },
  target: {
    type: String, // Data type for target: String (optional)
  },
  customers: [String], // Array of strings for customer names
  upcoming: {
    type: Boolean, // Data type for upcoming: Boolean
    required: true, // Makes upcoming a required field
  },
  success: {
    type: Boolean, // Data type for success: Boolean
    required: true, // Makes success a required field
    default: true, // Sets default value for success to true
  },
});

// Export the Launch model using the schema
module.exports = mongoose.model("Launch", launchesSchema);
