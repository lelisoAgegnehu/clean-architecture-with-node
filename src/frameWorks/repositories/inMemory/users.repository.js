const { inMemory: inMemoryDb } = require("../../database");

const { v4: uuidv4 } = require("uuid");

module.exports = {
  add: async (user) => {
    if (!user.id) {
      user.id = uuidv4();
    }
    inMemoryDb.users.push(user);
    return user;
  },
  update: async (user) => {
    const index = inMemoryDb.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      inMemoryDb.users[index] = user;
      return inMemoryDb.users[index];
    }
    return null;
  },
  delete: async (user) => {
    const index = inMemoryDb.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      inMemoryDb.users.splice(index, 1);
      return user;
    }
    return null;
  },
  getById: async (id) => {
    const user = inMemoryDb.users.find((u) => u.id === id);
    return user;
  },
};
