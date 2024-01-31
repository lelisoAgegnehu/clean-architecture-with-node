const express = require("express");
const routes = require("./frameWorks/expressSpecific/routes");

const app = express();

const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || "/api/v1";
const dependencies = require("./config/dependencies");
const ErrorHandler = require("./frameWorks/expressSpecific/ErrorHandler");
module.exports = {
  start: () => {
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    // TODO: add dependencies to the files
    app.use(API_PREFIX, routes(dependencies));

    // Common Error Handler
    app.use(ErrorHandler);

    app.listen(PORT, () => {
      console.log(`Our server is running on port ${PORT}`);
    });
  },
};
