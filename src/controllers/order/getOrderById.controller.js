const { Response } = require("../../frameWorks/common");

module.exports = (dependencies) => {
  const {
    useCases: {
      order: { getOrderByIdUseCase },
    },
  } = dependencies;

  return async (req, res, next) => {
    try {
      const { params = {} } = req;
      const { id } = params;
      const getOrderById = getOrderByIdUseCase(dependencies);
      const response = await getOrderById.execute({ id });
      res.json(new Response({ status: 200, content: response }));
      next();
    } catch (error) {
      next(error);
    }
  };
};
