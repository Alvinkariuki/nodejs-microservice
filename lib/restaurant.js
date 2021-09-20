module.exports = (optios) => {
  let seneca = this;
  let plugin = "restaurant";

  seneca.add({ role: plugin, cmd: "get" }, get);
  seneca.add({ role: plugin, cmd: "menu" }, menu);
  seneca.add({ role: plugin, cmd: "item" }, item);

  const get = (args, done) => {
    if (args.id) {
      return done(null, getRestaurant(args.id));
    } else {
      return done(null, restaurants);
    }
  };

  const item = (args, done) => {
    let restaurantId = args.restaurantId;
    let itemId = args.itemId;

    let restaurant = getRestaurant(restaurantId);
    let desc = restaurant.menu.filter((obj, idx) => {
      return obj.itemId == itemId;
    })[0];

    let value = {
      item: desc,
      restaurant,
    };

    return done(null, value);
  };

  const menu = (args, done) => {
    let menu = getRestaurant(args.id).menu;
    return done(null, menu);
  };

  const getRestaurant = (id) => {
    return restaurant.filter((r, idx) => {
      return r.id === id;
    })[0];
  };

  return { name: plugin };
};
