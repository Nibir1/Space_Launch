# Space_Launch - Node.js Backend & React.js Frontend

This project implements a Node.js backend API using Express for routing and Mongoose for interacting with a MongoDB database. It demonstrates best practices for modularity, data handling, and error management. React.js for frontend.

# Key Technologies

 - Node.js: JavaScript runtime environment for server-side development.
 - Express.js: Nodejs Web framework for building web applications and APIs.
 - Mongoose: ODM (Object Data Modeling) library for interacting with MongoDB databases.
 - dotenv: Library for loading environment variables from a .env file (for security).
 - Other Technologies I Used: Helmet for security, Morgan for logging

# Project Structure

 - app.js: Main application entry point, configures Express app and middleware.
 - routes: Directory containing route handlers for specific API endpoints (e.g., /upcoming, /launches, etc.).
 - models: Directory containing Mongoose models for data representation (e.g., Planet.js, Launch.js).
 - services: Directory for utility functions or services used throughout the project (e.g., database connection logic).
 - public: Directory for serving static files (e.g., HTML, CSS, JavaScript) if applicable.
 - package.json: File containing project dependencies and scripts.

# Getting Started

 - Clone this repository
 - Install dependencies: Check package.json for installation
 - Create a .env file in the project root directory and set any necessary environment variables (e.g., database connection string).
 - Start the server: npm start (or a custom script defined in package.json)

# Testing

This project utilizes Jest, a popular testing framework for JavaScript, to ensure code quality and functionality. Unit tests cover various aspects of the API, including:

 * Launches API
   - Successful retrieval of launches through GET requests to /v1/launches.
   - Successful creation of new launches through POST requests to /v1/launches with complete data validation.
   - Error handling for missing required launch properties and invalid launch dates in POST requests.

# Testing Setup

 - Before all tests, the code connects to the MongoDB database using mongoConnect with a timeout of 10 seconds.
 - After each test, the code disconnects from the database using mongoDisconnect to avoid resource leaks.

# Running Tests

 - Install Jest: npm install jest --save-dev (if not already installed).
 - Run tests: npm test (or a custom script defined in package.json).
