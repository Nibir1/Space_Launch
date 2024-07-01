// Import required functions from launches.model
const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

// Import getPagination function from query service
const { getPagination } = require("../../services/query");

// Function to handle HTTP GET requests for retrieving all launches
async function httpGetAllLaunches(req, res) {
  // Extract skip and limit parameters from query string using getPagination helper
  const { skip, limit } = getPagination(req.query);

  // Call the getAllLaunches function from launches.model to retrieve launches
  const launches = await getAllLaunches(skip, limit);

  // Return a successful response (status 200) with the launches data in JSON format
  return res.status(200).json(launches);
}

// Function to handle HTTP POST requests for creating a new launch
async function httpAddNewLaunch(req, res) {
  // Extract the launch data from the request body
  const launch = req.body;

  // Validate required launch properties (mission, rocket, launchDate, target)
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    // Return a bad request response (status 400) with an error message
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  // Convert launch date string to a Date object
  launch.launchDate = new Date(launch.launchDate);

  // Check if the launch date is a valid date (not NaN)
  if (isNaN(launch.launchDate)) {
    // Return a bad request response (status 400) with an error message
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  // Call the scheduleNewLaunch function from launches.model to create the launch
  await scheduleNewLaunch(launch);

  // Return a created response (status 201) with the newly created launch data in JSON format
  return res.status(201).json(launch);
}

// Function to handle HTTP DELETE requests for aborting a launch
async function httpAbortLaunch(req, res) {
  // Extract the launch ID from the request URL parameter
  const launchId = Number(req.params.id); // Convert string ID to a number

  // Check if the launch exists using the existsLaunchWithId function from launches.model
  const existsLaunch = await existsLaunchWithId(launchId);

  // If the launch doesn't exist
  if (!existsLaunch) {
    // Return a not found response (status 404) with an error message
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  // Call the abortLaunchById function from launches.model to abort the launch
  const aborted = await abortLaunchById(launchId);

  // If the launch was not aborted successfully
  if (!aborted) {
    // Return a bad request response (status 400) with an error message
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  // Return a successful response (status 200) with a simple confirmation message
  return res.status(200).json({
    ok: true,
  });
}

// Export the HTTP handler functions for routing
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
