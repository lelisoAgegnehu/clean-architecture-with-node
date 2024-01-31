const { Product } = require("../../entities");

module.exports = (dependencies) => {
  const { productRepository } = dependencies;

  if (!productRepository) {
    throw new Error("productRepository is not defined");
  }
  const execute = ({ product = {} }) => {
    return productRepository.update(product);
  };
  return { execute };
};
