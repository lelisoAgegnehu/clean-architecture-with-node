const { Product } = require("../../entities");

module.exports = (dependencies) => {
  const { productRepository } = dependencies;

  if (!productRepository) {
    throw new Error("productRepository is not defined");
  }
  const execute = ({ name, description, images, price, color, meta }) => {
    const product = new Product({
      name,
      description,
      images,
      price,
      color,
      meta,
    });

    return productRepository.add(product);
  };
  return { execute };
};
