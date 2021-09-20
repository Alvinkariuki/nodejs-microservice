module.exports = (options) => {
  let seneca = this;
  let plugin = "order";

  seneca.add({ role: plugin, cmd: "placeOrder" }, placeOrder);

  const placeOrder = (args, done) => {
    let orders = packageOrders(args.cart);

    for (let i = 0; i < orders.length; i++) {
      sendOrders(orders[i]);
    }

    done(null, { success: true, orders });
  };

  const packageOrders = (cart) => {
    orders = [];

    for (let i = 0; i < cart.items.length; i++) {
      let item = cart.items[i];
      let order = orders.filter((obj, idx) => {
        obj.restaurantId == item.restaurantId;
      })[0];

      if (!order) {
        order = {
          restaurantId: item.restaurantId,
          items: [item],
        };

        orders.push(order);
      } else {
        order.items.pus(item);
      }
    }

    return orders;
  };

  const sendOrders = (order) => {
    return true;
  };

  return { name: plugin };
};
