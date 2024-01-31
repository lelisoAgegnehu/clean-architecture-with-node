const addOrderController = require("./addOrder.controller");
const updateOrderController = require("./updateOrder.controller");
const deleteOrderController = require("./deleteOrder.controller");
const getOrderByIdController = require("./getOrderById.controller");

module.exports = (dependecies) => {
  return {
    addOrderController: addOrderController(dependecies),
    updateOrderController: updateOrderController(dependecies),
    deleteOrderController: deleteOrderController(dependecies),
    getOrderByIdController: getOrderByIdController(dependecies),
  };
};
