const { Response } = require("../../frameWorks/common");

module.exports = (dependencies) => {
  const {
    useCases: {
      product: { deleteProductUseCase },
    },
  } = dependencies;

  return async (req, res, next) => {
    try {
      const { body = {} } = req;
      const { id, name, description, price, images, color, meta } = body;
      const deleteProduct = deleteProductUseCase(dependencies);
      const response = await deleteProduct.execute({
        product: {
          id,
          name,
          description,
          price,
          images,
          color,
          meta,
        },
      });
      res.status(200).json(new Response({ status: true, content: response }));
    } catch (error) {
      next(error);
    }
  };
};
