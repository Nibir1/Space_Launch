const express = require("express");

// Import the HTTP handler functions from launches.controller
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controller");

// Create an Express Router object
const launchesRouter = express.Router();

// Define routes for launch-related operations

// GET /launches: Retrieve all launches (using httpGetAllLaunches handler)
launchesRouter.get("/", httpGetAllLaunches);

// POST /launches: Create a new launch (using httpAddNewLaunch handler)
launchesRouter.post("/", httpAddNewLaunch);

// DELETE /launches/:id: Abort a launch by ID (using httpAbortLaunch handler)
launchesRouter.delete("/:id", httpAbortLaunch);

// Export the launches router for use in the main application
module.exports = launchesRouter;
