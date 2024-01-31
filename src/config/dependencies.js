const useCases = require("../useCases");
const repositories = require("../frameWorks/repositories/inMemory");

module.exports = {
  useCases,
  ...repositories,
};
