module.exports = (options) => {
  let seneca = this;
  let plugin = "payment";

  seneca.add({ role: plugin, cmd: "pay" }, pay);

  let pay = (args, done) => {
    // TODO integrate with your credit card vendor
    done(null, { success: true });
  };

  return { name: plugin };
};
