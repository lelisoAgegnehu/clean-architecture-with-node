const { Chance } = require("chance");
const { cloneDeep } = require("lodash");
const { v4: uuidv4 } = require("uuid");
const { Order } = require("../../../src/entities");
const {
  userRepository,
  productRepository,
} = require("../../../src/frameWorks/repositories/inMemory");
const {
  order: {
    addOrderUseCase,
    deleteOrderUseCase,
    getOrderByIdUseCase,
    updateOrderUseCase,
  },
  user: { getUserByIdUseCase, addUserUseCase },
  product: { getProductByIdUseCase, addProductUseCase },
} = require("../../../src/useCases");
const {
  constants: {
    UserConstants: { genders },
  },
} = require("../../../src/entities");
const chance = new Chance();

describe("Order use case", () => {
  let testOrder;

  const mockOrderRepo = {
    add: jest.fn(async (order) => ({
      ...order,
      id: uuidv4,
    })),
    getById: jest.fn(async (id) => ({
      id,
      userId: uuidv4,
      productsIds: [uuidv4(), uuidv4()],
      date: chance.date(),
      isPayed: false,
      meta: {
        comment: "Please deliver it to me as soon as possible",
      },
    })),
    update: jest.fn(async (order) => order),
    delete: jest.fn(async (order) => order),
  };

  const dependencies = {
    orderRepository: mockOrderRepo,
    userRepository,
    productRepository,
    useCases: {
      user: {
        getUserByIdUseCase: jest.fn((dependencies) =>
          getUserByIdUseCase(dependencies)
        ),
      },
      product: {
        getProductByIdUseCase: jest.fn((dependencies) =>
          getProductByIdUseCase(dependencies)
        ),
      },
    },
  };

  const mocks = {};
  beforeAll(async () => {
    const addProduct = addProductUseCase(dependencies).execute;
    const addUser = addUserUseCase(dependencies).execute;

    mocks.products = await Promise.all(
      [1, 2, 3].map(() =>
        addProduct({
          name: chance.name(),
          description: chance.sentence(),
          images: [chance.url(), chance.url(), chance.url()],
          price: chance.natural(),
          color: chance.color(),
          meta: {
            review: chance.sentence(),
          },
        })
      )
    );

    mocks.users = await Promise.all(
      [1, 2, 3].map(() =>
        addUser({
          name: chance.name(),
          lastName: chance.last(),
          gender: genders.NOT_SPECIFIED,
          mata: {
            hair: {
              color: chance.color(),
            },
          },
        })
      )
    );
    testOrder = {
      userId: mocks.users[0].id,
      productsIds: mocks.products.map((product) => product.id),
      date: chance.date(),
      isPayed: false,
      meta: {
        comment: "Please deliver it to me as soon as possible",
      },
    };
  });

  describe("Add order user case", () => {
    test("Order should be added and returned", async () => {
      // call add order
      const addedOrder = await addOrderUseCase(dependencies).execute(testOrder);

      // check the result
      expect(addedOrder).toBeDefined();
      expect(addedOrder.id).toBeDefined();
      expect(addedOrder.userId).toBe(testOrder.userId);
      expect(addedOrder.productsIds).toEqual(testOrder.productsIds);
      expect(addedOrder.date).toBe(testOrder.date);
      expect(addedOrder.meta).toEqual(testOrder.meta);

      // check the call
      const expectedOrder = mockOrderRepo.add.mock.calls[0][0];
      expect(expectedOrder).toEqual(testOrder);
    });
  });

  describe("Get order by id user case", () => {
    test("Order should be returned by id", async () => {
      // add a fake id
      const fakeId = uuidv4;

      // call get order by id
      const returnedOrder = await getOrderByIdUseCase(dependencies).execute({
        id: fakeId,
      });

      // check the received data
      expect(returnedOrder).toBeDefined();
      expect(returnedOrder.id).toBeDefined();
      expect(returnedOrder.userId).toBeDefined();
      expect(returnedOrder.productsIds).toBeDefined();
      expect(returnedOrder.date).toBeDefined();
      expect(returnedOrder.isPayed).toBeDefined();
      expect(returnedOrder.meta).toBeDefined();

      // check the call
      const expectedId = mockOrderRepo.getById.mock.calls[0][0];
      expect(expectedId).toEqual(fakeId);
    });
  });

  describe("Update order user case", () => {
    test("Order should be updated", async () => {
      // init an order with id
      const mockOrder = { ...testOrder, id: uuidv4 };
      // call update
      const updatedOrder = await updateOrderUseCase(dependencies).execute({
        order: cloneDeep(mockOrder),
      });

      // check the result
      expect(updatedOrder).toEqual(mockOrder);

      // check the call
      const expectedOrder = mockOrderRepo.update.mock.calls[0][0];
      expect(expectedOrder).toEqual(mockOrder);
    });
  });

  describe("Delete order user case", () => {
    test("Order should be deleted", async () => {
      // init an order with id
      const mockOrder = cloneDeep({ ...testOrder, id: uuidv4 });

      // call delete
      const deletedOrder = await deleteOrderUseCase(dependencies).execute({
        order: mockOrder,
      });

      // check the data
      expect(deletedOrder).toEqual(mockOrder);

      // check the call
      const expectedOrder = mockOrderRepo.delete.mock.calls[0][0];
      expect(expectedOrder).toEqual(mockOrder);
    });
  });
});
