const http = require("http"); // Import the HTTP module for creating a server
require("dotenv").config(); // Load environment variables

// Import the Express application instance
const app = require("./app");

// Import functions from services and models
const { mongoConnect } = require("./services/mongo"); // Connect to MongoDB
const { loadPlanetsData } = require("./models/planets.model"); // Load planets data
const { loadLaunchData } = require("./models/launches.model"); // Load launch data

// Get the port number from the environment or default to 8000
const PORT = process.env.PORT || 8000;

// Create an HTTP server instance using the Express app
const server = http.createServer(app);

// Asynchronous function to start the server
async function startServer() {
  // Connect to MongoDB database
  await mongoConnect();

  // Load initial planets data from a source (e.g., file, database)
  await loadPlanetsData();

  // Load initial launch data from a source (e.g., file, database)
  await loadLaunchData();

  // Start listening for incoming requests on the specified port
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

// Start the server by calling the startServer function
startServer();
