const { Response } = require("../../frameWorks/common");

module.exports = (dependencies) => {
  const {
    useCases: {
      order: { deleteOrderUseCase },
    },
  } = dependencies;

  return async (req, res, next) => {
    try {
      const { body = {} } = req;
      const { id, userId, productsIds, date, isPayed, meta } = body;
      const deleteOrder = deleteOrderUseCase(dependencies);
      const response = await deleteOrder.execute({
        order: {
          id,
          userId,
          productsIds,
          date,
          isPayed,
          meta,
        },
      });
      res.json(new Response({ status: 200, content: response }));
      next();
    } catch (error) {
      next(error);
    }
  };
};
