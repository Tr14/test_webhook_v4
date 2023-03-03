'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    ctx.body = "Send Token Success";

    var validJSON = ctx.request.body;

    var eventstring = validJSON.replace(/^["'](.+(?=["']$))["']$/, '$1');

    console.log(eventstring);

    var data = JSON.parse(eventstring);

    console.log(data);

    let deviceID = [];
    let token = [];
    let deviceName = [];
    let deviceOS = [];
    let platform = [];

    deviceID = data.DeviceID;
    token = data.Token;
    deviceName = data.DeviceName;
    deviceOS = data.DeviceOS;
    platform = data.Platform;

    let entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').create({
      data: {
        deviceID: deviceID,
        token: token,
        deviceOS: deviceOS,
        deviceName: deviceName,
        platform: platform,
        status: "Live"
      }
    });
  },

  async getToken(ctx) {
    ctx.body = ctx.request;
    console.log(ctx.body)
    const entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').findMany({
      where: {
        deviceID: "82a34c5123083499",
      },
    });
  },

  async updateUser(ctx) {
    ctx.body = "Update User Identify Success";

    let userIdentified = [];

    var validJSON = ctx.request.body;

    var eventstring = validJSON.replace(/^["'](.+(?=["']$))["']$/, '$1');

    console.log(eventstring);

    var data = JSON.parse(eventstring);

    console.log(data);

    userIdentified = data.userIdentified

    await strapi.db.query('plugin::firebasetoken.firebasetoken').updateMany({
      where: {
        deviceID: "82a34c5123083499",
      },
      data: {
        userIdentified: userIdentified,
      },
    });
  }
});
