const path = require("path"); // Path manipulation library
const cors = require("cors"); // Cross-Origin Resource Sharing middleware
const morgan = require("morgan"); // HTTP request logger middleware
const helmet = require("helmet"); // Security middleware
const express = require("express"); // Web framework

const api_v1 = require("./routes/api_v1"); // Import API routes for version 1

// Create an Express application instance
const app = express();

// Apply security middleware (recommended for most applications)
app.use(helmet());

// Configure CORS to allow requests from specific origin (localhost:3000 in this case)
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Log HTTP requests in combined format for debugging purposes
app.use(morgan("combined"));

// Parse incoming JSON request bodies (required for most APIs)
app.use(express.json());

// Serve static files from the public directory (optional)
app.use(express.static(path.join(__dirname, "..", "public")));

// Mount the API routes for version 1 under the /v1 path
app.use("/v1", api_v1);

// Catch-all route for unmatched paths (serves index.html for SPAs)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Export the Express application instance for use in the server
module.exports = app;
