module.exports = (dependencies) => {
  const { userRepository } = dependencies;
  if (!userRepository) {
    throw new Error("the user repository should be exist in dependencies");
  }

  const execute = ({ id }) => {
    return userRepository.getById(id);
  };
  return { execute };
};
