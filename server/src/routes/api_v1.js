const express = require("express");

// Import the routers from their respective files
const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

// Create a Router object for the API version (v1)
const api_v1 = express.Router();

// Mount the planets router under the /planets path within the v1 router
api_v1.use("/planets", planetsRouter);

// Mount the launches router under the /launches path within the v1 router
api_v1.use("/launches", launchesRouter);

// Export the v1 router
module.exports = api_v1;
