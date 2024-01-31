const { User } = require("../../entities");

module.exports = (dependencies) => {
  const { userRepository } = dependencies;
  if (!userRepository) {
    throw new Error("the user repository should be exist in dependencies");
  }

  const execute = ({ name, lastName, gender, meta }) => {
    const user = new User({
      name,
      lastName,
      gender,
      meta,
    });
    return userRepository.add(user);
  };
  return { execute };
};
