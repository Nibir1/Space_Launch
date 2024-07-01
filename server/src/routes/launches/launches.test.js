const request = require("supertest"); // HTTP test client
const app = require("../../app"); // Your main application file
const { mongoConnect, mongoDisconnect } = require("../../services/mongo"); // MongoDB connection functions

// Describe block for testing Launches API
describe("Launches API", () => {
  // Connect to MongoDB before all tests (timeout: 10 seconds)
  beforeAll(async () => {
    await mongoConnect();
  }, 10000);

  // Disconnect from MongoDB after all tests
  afterEach(async () => {
    await mongoDisconnect();
  });

  // Describe block for testing GET /v1/launches
  describe("Test GET /v1/launches", () => {
    // Test case for successful GET response (200)
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches") // Send a GET request to /v1/launches
        .expect("Content-Type", /json/) // Expect JSON content type
        .expect(200); // Expect a status code of 200 (success)
    });
  });

  // Describe block for testing POST /v1/launches
  describe("Test POST /launch", () => {
    // Sample launch data for testing
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    const launchDataWithinvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "Zoot",
    };

    // Test case for successful POST with complete data (201)
    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches") // Send a POST request to /v1/launches
        .send(completeLaunchData) // Send launch data in the request body
        .expect("Content-Type", /json/) // Expect JSON content type
        .expect(201); // Expect a status code of 201 (created)

      // Convert launch dates to timestamps for comparison
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      // Assertions for response data
      expect(responseDate).toBe(requestDate); // Check if launch dates match
      expect(response.body).toMatchObject(launchDataWithoutDate); // Check response body structure (excluding launchDate)
    });

    // Test case for missing required properties (400)
    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches") // Send a POST request to /v1/launches
        .send(launchDataWithoutDate) // Send incomplete launch data
        .expect("Content-Type", /json/) // Expect JSON content type
        .expect(400); // Expect a status code of 400 (bad request)

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      }); // Check for specific error message
    });

    // Test case for invalid launch date (400)
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches") // Send a POST request to /v1/launches
        .send(launchDataWithinvalidDate) // Send launch data with invalid date
        .expect("Content-Type", /json/) // Expect JSON content type
        .expect(400); // Expect a status code of 400 (bad request)

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      }); // Check for specific error message
    });
  });
});
