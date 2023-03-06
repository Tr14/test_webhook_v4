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

    const count = await strapi.db.query('plugin::firebasetoken.firebasetoken').count({
      where: {
        deviceID: deviceID,
      },
    });

    const record = await strapi.db.query('plugin::firebasetoken.firebasetoken').findMany({
      where: {
        status: "Dead",
      },
    });

    let status = [];

    console.log(record);

    for (let i = 0; i < record.length; i++) {
      status = record[i].status;

      console.log(status);
    };

    if (count <= 2) {
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
    } else {
      console.log("Does not match any cases")
    }
  },

  async getToken(ctx) {
    ctx.body = "Get Token Success";

    const entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').findMany({
      where: {
        status: 'Live',
      },
    });

    for (let i = 0; i < entry.length; i++) {
      ctx.body = entry[i];
    }
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
  },

  async deleteToken(ctx) {
    ctx.body = "Delete token Success";

    await strapi.db.query('plugin::firebasetoken.firebasetoken').deleteMany({
      where: {
        token: ''
      },
    });
  },

  async updateToken(ctx) {
    ctx.body = "Update token Success";

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

    await strapi.db.query('plugin::firebasetoken.firebasetoken').updateMany({
      where: {
        deviceID: deviceID,
        status: "Dead",
      },
      data: {
        token: token,
        deviceOS: deviceOS,
        deviceName: deviceName,
        platform: platform,
        status: "Live"
      },
    });
  }
});
