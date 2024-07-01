// Import the getAllPlanets function from planets.model.js
const { getAllPlanets } = require("../../models/planets.model");

// Function to handle HTTP GET requests for retrieving all planets
async function httpGetAllPlanets(req, res) {
  // Call the getAllPlanets function (presumably from planets.model)
  // to retrieve all planets from the database.
  const planets = await getAllPlanets();

  // Return a successful response (status code 200) with the planets data in JSON format
  return res.status(200).json(planets);
}

// Export the httpGetAllPlanets function for use in the main application
module.exports = { httpGetAllPlanets };
