const { Response } = require("../../frameWorks/common");

module.exports = (dependencies) => {
  const {
    useCases: {
      product: { addProductUseCase },
    },
  } = dependencies;

  return async (req, res, next) => {
    try {
      const { body = {} } = req;
      const { name, description, price, images, color, meta } = body;
      const addProduct = addProductUseCase(dependencies);
      const response = await addProduct.execute({
        name,
        description,
        price,
        images,
        color,
        meta,
      });
      res.status(201).json(new Response({ status: true, content: response }));
      next();
    } catch (error) {
      next(error);
    }
  };
};
