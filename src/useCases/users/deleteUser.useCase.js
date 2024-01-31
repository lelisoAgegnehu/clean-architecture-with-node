const { User } = require("../../entities");

module.exports = (dependencies) => {
  const { userRepository } = dependencies;
  if (!userRepository) {
    throw new Error("the user repository should be exist in dependencies");
  }

  const execute = ({ user = {} }) => {
    return userRepository.delete(user);
  };
  return { execute };
};
