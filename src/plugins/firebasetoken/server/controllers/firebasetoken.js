'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    ctx.body = "Send Token Success";

    var validJSON = ctx.request.body;

    var eventstring = validJSON.replace(/^["'](.+(?=["']$))["']$/, '$1');

    var data = JSON.parse(eventstring);

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
    ctx.body = "Get Token Success";

    const entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').findMany({
      where: {
        status: 'Live',
      },
    });

    console.log(entry);
  },

  async updateUser(ctx) {
    ctx.body = "Update User Identify Success";

    let userIdentified = [];
    let deviceID = [];

    var validJSON = ctx.request.body;

    var eventstring = validJSON.replace(/^["'](.+(?=["']$))["']$/, '$1');

    var data = JSON.parse(eventstring);

    userIdentified = data.userIdentified;
    deviceID = data.DeviceID;

    await strapi.db.query('plugin::firebasetoken.firebasetoken').updateMany({
      where: {
        deviceID: deviceID,
      },
      data: {
        userIdentified: userIdentified,
      },
    });
  }
});
