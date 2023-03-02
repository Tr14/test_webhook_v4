'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    let token = [];
    let deviceID = [];
    let deviceName = [];
    let deviceOS = [];
    let platform = [];
    let status = [];

    let entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').create({
      data: {
        record: "AKA",
        token: token,
        deviceID: deviceID,
        deviceName: deviceName,
        deviceOS: deviceOS,
        platform: platform,
        status: status
      }
    });
  },

  async getToken(ctx) {
    ctx.body = "GET TOKEN"
  },
});
