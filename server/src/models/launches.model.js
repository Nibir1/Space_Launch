// Import necessary modules
const axios = require("axios"); // Used for making HTTP requests to SpaceX API
const launchesDatabase = require("./launches.mongo"); // Provides access to the launches database
const planets = require("./planets.mongo"); // Provides access to the planets database

// Constant for default flight number (used if no launches exist)
const DEFAULT_FLIGHT_NUMBER = 100;

// URL for SpaceX API launches endpoint
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

// Function to download and populate launches data from SpaceX API
async function populateLaunches() {
  console.log("Downloading launches data.....");

  // Make a POST request to SpaceX API with specific options
  const response = await axios.post(SPACEX_API_URL, {
    query: {}, // Empty query to retrieve all launches
    options: {
      pagination: false, // Disable pagination for all data in one response
      populate: [
        {
          path: "rocket", // Include nested rocket data in the response
          select: { name: 1 }, // Select only the "name" field from the rocket object
        },
        {
          path: "payloads", // Include nested payloads data in the response
          select: { customers: 1 }, // Select only the "customers" field from each payload object
        },
      ],
    },
  });

  // Check for successful response status code (200)
  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  // Extract launch documents from the response data
  const launchDocs = response.data.docs;

  // Loop through each launch document
  for (const launchDoc of launchDocs) {
    // Extract relevant data from the launch document
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]); // Combine all customer lists from payloads

    // Create a new launch object with extracted data
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    // Log launch details to the console
    console.log(`${launch.flightNumber} ${launch.mission}`);

    // Save the launch data to the database
    await saveLaunch(launch);
  }
}

// Function to check if launch data is already loaded or populate if not
async function loadLaunchData() {
  // Find the first launch with specific criteria (usually the first SpaceX launch)
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  // If launch data exists, log a message
  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    // If no launch data exists, download and populate from SpaceX API
    await populateLaunches();
  }
}

// Function to find a launch by specific filter criteria
async function findLaunch(filter) {
  // Use the launches database to find one document matching the filter
  return await launchesDatabase.findOne(filter);
}

// Function to check if a launch exists with a specific launch ID
async function existsLaunchWithId(launchId) {
  // Create a filter object for the launch ID
  const filter = { flightNumber: launchId };

  // Call the findLaunch function with the filter to check existence
  return await findLaunch(filter);
}

// Function to get the latest flight number from the database
async function getLatestFlightNumber() {
  // Find the latest launch document sorted by descending flight number
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

  // If no launches exist, return the default flight number
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  // Return the flight number from the latest launch document
  return latestLaunch.flightNumber;
}

// Function to retrieve all launches with pagination options
async function getAllLaunches(skip, limit) {
  // Find all launch documents, excluding specific fields (ID and version) for better performance
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 }) // Find all documents, exclude _id and __v fields
    .sort({ flightNumber: 1 }) // Sort launches by flight number in ascending order
    .skip(skip) // Skip a certain number of documents (for pagination)
    .limit(limit); // Limit the number of documents returned (for pagination)
}

// Function to save a launch document to the database
async function saveLaunch(launch) {
  // Use findOneAndUpdate to update existing launch or insert a new one if it doesn't exist
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber, // Find a launch with matching flight number
    },
    launch, // Update document with the provided launch data
    {
      upsert: true, // If no launch is found, insert a new document
    }
  );
}

// Function to schedule a new launch
async function scheduleNewLaunch(launch) {
  // Find the target planet by its Kepler name
  const planet = await planets.findOne({ keplerName: launch.target });

  // Throw an error if no matching planet is found
  if (!planet) {
    throw new Error("No mathcing planet was found");
  }

  // Get the latest flight number and increment it for the new launch
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  // Create a new launch object with default success, upcoming status, predefined customers, and the new flight number
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero To Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  // Save the new launch data to the database
  await saveLaunch(newLaunch);
}

// Function to abort a launch by its ID
async function abortLaunchById(launchId) {
  // Update the launch document with the specified ID, setting upcoming and success flags to false
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  // Check if exactly one document was modified (indicating successful update)
  return aborted.modifiedCount === 1;
}

// Export the functions as properties of a module
module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
