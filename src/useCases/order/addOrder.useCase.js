const { Order } = require("../../entities");
const { isEmpty } = require("lodash");
const {
  ValidationError,
  ResponseError,
} = require("../../frameWorks/common/Response");

module.exports = (dependencies) => {
  const {
    orderRepository,
    useCases: {
      user: { getUserByIdUseCase },
      product: { getProductByIdUseCase },
    },
  } = dependencies;

  if (!orderRepository) {
    throw new Error("orderRepository should be exist in dependencies");
  }

  if (!getUserByIdUseCase) {
    throw new Error("getUserByIdUseCase should be exist in dependencies");
  }

  if (!getProductByIdUseCase) {
    throw new Error("getProductByIdUseCase should be exist in dependencies");
  }

  const getUserById = getUserByIdUseCase(dependencies).execute;
  const getProductById = getProductByIdUseCase(dependencies).execute;

  const getValidationErrors = async ({ order }) => {
    const returnable = [];

    const { productsIds = [], userId } = order;
    const products = await Promise.all(
      productsIds.map((productId) => getProductById({ id: productId }))
    );

    const notFoundIds = products.reduce((acc, product, i) => {
      if (!product) {
        acc.push(productsIds[i]);
      }
      return acc;
    }, []);

    if (!isEmpty(notFoundIds)) {
      returnable.push(
        new ValidationError({
          field: "productsIds",
          msg: `No products with ids ${notFoundIds.join(", ")}`,
        })
      );
    }

    const user = await getUserById({ id: userId });
    if (!user) {
      returnable.push(
        new ValidationError({
          field: "userId",
          msg: `No user with id ${userId}`,
        })
      );
    }

    return returnable;
  };

  const execute = async ({ userId, productsIds, date, isPayed, meta }) => {
    const order = new Order({
      date,
      productsIds,
      meta,
      isPayed,
      userId,
    });

    const validationErrors = await getValidationErrors({ order });

    if (!isEmpty(validationErrors)) {
      return Promise.reject(
        new ResponseError({
          status: 403,
          msg: "Validation Errors",
          reason: "Somebody sent bad data",
          validationErrors,
        })
      );
    }
    return orderRepository.add(order);
  };
  return { execute };
};
