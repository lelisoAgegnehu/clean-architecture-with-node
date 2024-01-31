const { Response } = require("../../frameWorks/common");

module.exports = (dependencies) => {
  const {
    useCases: {
      product: { getProductByIdUseCase },
    },
  } = dependencies;

  return async (req, res, next) => {
    try {
      const { params = {} } = req;
      const { id } = params;
      const getProductById = getProductByIdUseCase(dependencies);
      const response = await getProductById.execute({
        id,
      });
      res.status(200).json(new Response({ status: true, content: response }));
    } catch (error) {
      next(error);
    }
  };
};
