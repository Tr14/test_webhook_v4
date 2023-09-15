'use strict';

module.exports = {
  async send(ctx) {
    ctx.body = "Hello from AKA webhook"
    console.log("METHOD executed")
  },
};
