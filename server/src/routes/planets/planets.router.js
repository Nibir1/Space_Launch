const express = require("express");
const { httpGetAllPlanets } = require("./planets.controller");

// Create an Express Router object
const planetsRouter = express.Router();

// Define a route for retrieving all planets
planetsRouter.get("/", httpGetAllPlanets);

// Export the planets router
module.exports = planetsRouter;
