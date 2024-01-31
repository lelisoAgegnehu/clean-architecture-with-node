const Chance = require("chance");
const chance = new Chance();

const { cloneDeep } = require("lodash");
const {
  userRepository,
} = require("../../../src/frameWorks/repositories/inMemory/");
const {
  User,
  constants: {
    UserConstants: { genders },
  },
} = require("../../../src/entities");

describe("Users repository", () => {
  test("New user should be added and returned", async () => {
    const testUser = new User({
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.FEMALE,
      meta: { hair: { color: "black" } },
    });

    const addedUser = await userRepository.add(testUser);

    expect(addedUser).toBeDefined();
    expect(addedUser.id).toBe(testUser.id);
    expect(addedUser.name).toBe(testUser.name);
    expect(addedUser.lastName).toBe(testUser.lastName);
    expect(addedUser.gender).toBe(testUser.gender);
    expect(addedUser.meta).toEqual(testUser.meta);

    const returnedUser = await userRepository.getById(addedUser.id);
    expect(returnedUser).toEqual(addedUser);
  });
  test("User should be deleted", async () => {
    // init two users
    const willBeDeletedUser = new User({
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.FEMALE,
      meta: { hair: { color: "black" } },
    });

    const shouldStayUser = new User({
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.FEMALE,
      meta: { hair: { color: "blonde" } },
    });
    // add two users

    const [willBeDeletedAddedUser, shouldStayAddedUser] = await Promise.all([
      userRepository.add(willBeDeletedUser),
      userRepository.add(shouldStayUser),
    ]);
    expect(willBeDeletedAddedUser).toBeDefined();
    expect(shouldStayAddedUser).toBeDefined();

    // delete one user
    const deletedUser = await userRepository.delete(willBeDeletedAddedUser);
    expect(deletedUser).toBe(willBeDeletedAddedUser);
    // try to get deleted user ( should be undefined )
    const shouldBeUndefinedUser = await userRepository.getById(deletedUser.id);
    expect(shouldBeUndefinedUser).toBeUndefined();

    // check that the second user defined (not deleted)
    const shouldBeDefinedUser = await userRepository.getById(
      shouldStayAddedUser.id
    );
    expect(shouldBeDefinedUser).toBeDefined();
  });
  test("User should be updated and returned", async () => {
    // added a user
    const testUser = new User({
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.FEMALE,
      meta: { hair: { color: "black" } },
    });
    const addedUser = await userRepository.add(testUser);
    expect(addedUser).toBeDefined();

    // update the user
    const cloneUser = cloneDeep({
      ...addedUser,
      name: chance.name(),
      gender: genders.MALE,
    });

    const updateUser = await userRepository.update(cloneUser);
    expect(updateUser).toEqual(cloneUser);
  });
});
