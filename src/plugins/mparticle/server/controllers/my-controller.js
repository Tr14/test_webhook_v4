'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('mparticle')
      .service('myService')
      .getWelcomeMessage();
  },
});
