const { Response } = require("../../frameWorks/common");

module.exports = (dependencies) => {
  const {
    useCases: {
      order: { addOrderUseCase },
    },
  } = dependencies;

  return async (req, res, next) => {
    try {
      const { body = {} } = req;
      const { userId, productsIds, date, isPayed, meta } = body;
      const addOrder = addOrderUseCase(dependencies);
      const response = await addOrder.execute({
        userId,
        productsIds,
        date,
        isPayed,
        meta,
      });
      res.json(new Response({ status: 201, content: response }));
      next();
    } catch (error) {
      next(error);
    }
  };
};
