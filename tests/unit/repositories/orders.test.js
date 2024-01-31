const Chance = require("chance");
const { cloneDeep, add } = require("lodash");
const { v4: uuidv4 } = require("uuid");

const {
  orderRepository,
} = require("../../../src/frameWorks/repositories/inMemory");

const { Order } = require("../../../src/entities");
const chance = new Chance();
describe("Orders repository", () => {
  test("New Orders should be added and returned", async () => {
    // add a new order
    const testOrder = new Order({
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: new Date(),
      isPayed: true,
      meta: {
        comment: "Deliver it to me as soon as possible",
      },
    });
    const addedOrder = await orderRepository.add(testOrder);
    // check the order
    expect(addedOrder).toBeDefined();
    expect(addedOrder.id).toBeDefined();
    expect(addedOrder.userId).toBe(testOrder.userId);
    expect(addedOrder.productsIds).toEqual(testOrder.productsIds);
    expect(addedOrder.date).toEqual(testOrder.date);
    expect(addedOrder.isPayed).toBe(testOrder.isPayed);
    expect(addedOrder.meta).toEqual(testOrder.meta);

    // get the order anc check that it is equal
    const returnedOrder = await orderRepository.getById(addedOrder.id);
    expect(returnedOrder).toEqual(addedOrder);
  });
  test("New Orders should be deleted", async () => {
    // add two orders
    const willBeDeletedOrder = new Order({
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: chance.date(),
      isPayed: true,
      meta: {
        comment: "Deliver it to me as soon as possible",
      },
    });

    const shouldStayOrder = new Order({
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: chance.date(),
      isPayed: true,
      meta: {
        comment: "Deliver it to me as soon as possible",
      },
    });

    const [willBeDeletedAddedOrder, shouldStayAddedOrder] = await Promise.all([
      orderRepository.add(willBeDeletedOrder),
      orderRepository.add(shouldStayOrder),
    ]);
    expect(willBeDeletedAddedOrder).toBeDefined();
    expect(shouldStayAddedOrder).toBeDefined();

    // delete one order
    const deletedOrder = await orderRepository.delete(willBeDeletedAddedOrder);
    expect(deletedOrder).toEqual(willBeDeletedAddedOrder);

    // try to get the deleted order and it should be undefined
    const shouldBeUndefinedOrder = await orderRepository.getById(
      deletedOrder.id
    );
    expect(shouldBeUndefinedOrder).toBeUndefined();

    // check that just relevant order deleted
    const shouldBeDefinedOrder = await orderRepository.getById(
      shouldStayAddedOrder.id
    );
    expect(shouldBeDefinedOrder).toBeDefined();
  });
  test("New Orders should be updated", async () => {
    // add a new order
    const testOrder = new Order({
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: chance.date(),
      isPayed: true,
      meta: {
        comment: "Deliver it to me as soon as possible",
      },
    });

    const addedOrder = await orderRepository.add(testOrder);
    expect(addedOrder).toBeDefined();

    // update an order (wit cloning)

    const cloneOrder = cloneDeep({
      ...addedOrder,
      isPayed: false,
      productsIds: [...testOrder.productsIds, uuidv4()],
    });

    const updatedOrder = await orderRepository.update(cloneOrder);
    //check the update
    expect(updatedOrder).toEqual(cloneOrder);
  });
});
