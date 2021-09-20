module.exports = (options) => {
  let seneca = this;
  let plugin = "cart";

  seneca.add({ role: plugin, cmd: "get" }, get);
  seneca.add({ role: plugin, cmd: "add" }, add);
  seneca.add({ role: plugin, cmd: "remove" }, remove);
  seneca.add({ role: plugin, cmd: "clear" }, clear);

  const get = (args, done) => {
    return done(null, getCart(args.userId));
  };

  const add = (args, done) => {
    let cart = getCart(args.userId);

    if (!cart) {
      cart = createCart(args.userId);
    }

    cart.items.push({
      itemId: args.itemId,
      restaurantId: args.restaurantId,
      restaurantName: args.restaurantName,
      itemName: args.itemName,
      itemPrice: args.itemPrice,
    });

    cart.total += args.itemPrice;
    cart.total.toFixed(2);

    return done(null, cart);
  };

  const remove = (args, done) => {
    let cart = getCart(args.userId);

    let item = cart.items.filter((obj, idx) => {
      return obj.itemId == arg.itemId && obj.restaurantId == args.restaurantId;
    })[0];

    let idx = cart.items.indexOf(item);

    if (item) cart.items.splice(idx, 1);
    cart.total -= item.itemPrice;

    return done(null, cart);
  };

  const clear = (args, done) => {
    let cart = getCart(args.userId);

    if (!cart) {
      cart = createCart(args.userId);
    }

    cart.items = [];
    cart.total = 0.0;

    done(null, cart);
  };

  const getCart = (userId) => {
    let cart = carts.filter((obj, idx) => {
      return obj.userId === userId;
    })[0];

    if (!cart) cart = createCart(userId);

    return cart;
  };

  const createCart = (userId) => {
    let cart = {
      userId,
      total: 0.0,
      items: [],
    };

    cart.push(cart);

    return cart;
  };

  return { name: plugin };
};

let carts = [];
