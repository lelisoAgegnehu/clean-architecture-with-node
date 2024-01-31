const { inMemory: inMemoryDb } = require("../../database");

const { v4: uuidv4 } = require("uuid");

module.exports = {
  add: async (order) => {
    if (!order.id) {
      order.id = uuidv4();
    }
    inMemoryDb.orders.push(order);
    return order;
  },
  update: async (order) => {
    const index = inMemoryDb.orders.findIndex((u) => u.id === order.id);
    if (index >= 0) {
      inMemoryDb.orders[index] = order;
      return inMemoryDb.orders[index];
    }
    return null;
  },
  delete: async (order) => {
    const index = inMemoryDb.orders.findIndex((u) => u.id === order.id);
    if (index >= 0) {
      inMemoryDb.orders.splice(index, 1);
      return order;
    }
    return null;
  },
  getById: async (id) => {
    const order = inMemoryDb.orders.find((u) => u.id === id);
    return order;
  },
};
