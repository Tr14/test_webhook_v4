'use strict';

module.exports = ({ strapi }) => ({
  sendToken(ctx) {
    ctx.body = "SEND TOKEN"
  },

  getToken(ctx) {
    ctx.body = "GET TOKEN"
  },
});
