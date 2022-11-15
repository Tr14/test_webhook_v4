'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('zalo')
      .service('myService')
      .getWelcomeMessage();
  },
});
