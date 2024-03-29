const {
  User,
  constants: {
    UserConstants: { genders },
  },
} = require("../../../src/entities");
const { v4: uuidv4 } = require("uuid");
const Chance = require("chance");
const {
  addUserUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase,
} = require("../../../src/useCases/users");
const chance = new Chance();

describe("User use cases", () => {
  const mockUserRepo = {
    add: jest.fn(async (user) => ({
      ...user,
      id: uuidv4,
    })),
    getById: jest.fn(async (id) => ({
      id,
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.NOT_SPECIFIED,
      meta: {},
    })),
    update: jest.fn(async (user) => user),
    delete: jest.fn(async (user) => user),
  };

  const dependencies = { userRepository: mockUserRepo };

  describe("User should be added", () => {
    test("User should be added", async () => {
      // create a user data
      const testUserData = {
        name: chance.name(),
        lastName: chance.last(),
        gender: genders.MALE,
        meta: {
          hair: {
            color: "red",
          },
        },
      };

      // add a user using the use case
      const addedUser = await addUserUseCase(dependencies).execute(
        testUserData
      );

      // check the user received data
      expect(addedUser).toBeDefined();
      expect(addedUser.id).toBeDefined();
      expect(addedUser.name).toBe(testUserData.name);
      expect(addedUser.lastName).toBe(testUserData.lastName);
      expect(addedUser.gender).toBe(testUserData.gender);
      expect(addedUser.meta).toEqual(testUserData.meta);

      // check that the dependencies were called as expected
      const call = mockUserRepo.add.mock.calls[0][0];
      expect(call.id).toBeUndefined();
      expect(call.name).toBe(testUserData.name);
      expect(call.lastName).toBe(testUserData.lastName);
      expect(call.gender).toBe(testUserData.gender);
      expect(call.meta).toEqual(testUserData.meta);
    });
  });

  describe("Get user use case", () => {
    test("User should returned by id", async () => {
      // generate a random id
      const randomId = uuidv4();
      // call get user by id
      const userById = await getUserByIdUseCase(dependencies).execute({
        id: randomId,
      });

      // check the data
      expect(userById).toBeDefined();
      expect(userById.id).toBe(randomId);
      expect(userById.name).toBeDefined();
      expect(userById.lastName).toBeDefined();
      expect(userById.gender).toBeDefined();
      expect(userById.meta).toBeDefined();

      //check the mock
      const expectedId = mockUserRepo.getById.mock.calls[0][0];
      expect(expectedId).toBe(randomId);
    });
  });

  describe("Update user use case", () => {
    test("User should updated", async () => {
      const testData = {
        id: uuidv4(),
        name: chance.name(),
        lastName: chance.last(),
        gender: genders.MALE,
        meta: {
          education: {
            school: "gallessa",
          },
        },
      };
      // create a user data

      // call update a user
      const updatedUser = await updateUserUseCase(dependencies).execute({
        user: testData,
      });

      // check the result
      expect(updatedUser).toEqual(testData);

      // check the call
      const expectedUser = mockUserRepo.update.mock.calls[0][0];
      expect(expectedUser).toEqual(testData);
    });
  });

  describe("Delete user use case", () => {
    test("User should be deleted", async () => {
      // create a test data
      const testData = {
        id: uuidv4(),
        name: chance.name(),
        lastName: chance.last(),
        gender: genders.MALE,
        meta: {
          education: {
            school: "gallessa",
          },
        },
      };
      // call delete
      const deletedUser = await deleteUserUseCase(dependencies).execute({
        user: testData,
      });

      // check the returned data
      expect(deletedUser).toEqual(testData);

      // check the call
      const expectedUser = mockUserRepo.delete.mock.calls[0][0];
      expect(expectedUser).toEqual(testData);
    });
  });
});
