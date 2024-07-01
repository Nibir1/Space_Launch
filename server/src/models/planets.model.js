// Import necessary modules
const fs = require("fs"); // File system access
const path = require("path"); // Path manipulation
const { parse } = require("csv-parse"); // CSV parsing library
const planets = require("./planets.mongo"); // Provides access to the planets database

// Function to determine if a planet is habitable based on specific criteria
function isHabitablePlanet(planet) {
  // Check for confirmed disposition, suitable solar insolation, and orbital radius
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_insol"] < 1.6
  );
}

// Function to load habitable planet data from a CSV file
function loadPlanetsData() {
  // Return a new Promise object for asynchronous handling
  return new Promise((resolve, reject) => {
    // Create a read stream for the Kepler data CSV file
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "kepler_data.csv"
    );
    const stream = fs.createReadStream(filePath);

    // Pipe the stream to the CSV parser
    stream
      .pipe(
        parse({
          comment: "#", // Ignore lines starting with "#" (comments)
          columns: true, // Treat each row as an object with named properties
        })
      )
      .on("data", async (data) => {
        // Check if the planet is habitable based on defined criteria
        if (isHabitablePlanet(data)) {
          // Save the habitable planet data to the database
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err); // Log any errors during parsing
        reject(err); // Reject the Promise with the error
      })
      .on("end", async () => {
        // Get the total number of planets found in the database
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found`);
        resolve(); // Resolve the Promise after processing completes
      });
  });
}

// Function to retrieve all planets from the database
async function getAllPlanets() {
  // Use the planets database to find all documents, excluding specific fields
  return await planets.find({}, { _id: 0, __v: 0 });
}

// Function to save a planet document to the database
async function savePlanet(planet) {
  try {
    // Use findOneAndUpdate to update existing or insert a new planet document
    await planets.updateOne(
      {
        keplerName: planet.kepler_name, // Find a planet with matching Kepler name (if exists)
      },
      {
        keplerName: planet.kepler_name, // Update the Kepler name field
      },
      {
        upsert: true, // Insert a new document if no match is found
      }
    );
  } catch (err) {
    console.error(`Could not save a planet ${err}`); // Log any errors during saving
  }
}

// Export functions as properties of a module
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
