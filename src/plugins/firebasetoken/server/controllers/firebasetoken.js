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
    //let deviceID = [];
    //let deviceName = [];
    //let deviceOS = [];
    //let platform = [];
    //let status = [];

    deviceID = data.DeviceID;
    token = data.Token;

    //deviceID = data_body[i].DeviceID;
    //deviceName = data_body[i].DeviceName;
    //deviceOS = data_body[i].DeviceOS;
    //platform = data_body[i].Platform;
    //status = data_body[i].Status;

    let entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').create({
      data: {
        deviceID: deviceID,
        token: token,
        //deviceID: deviceID,
        //deviceName: deviceName,
        //deviceOS: deviceOS,
        //platform: platform,
        //status: status
      }
    });
  },

  async getToken(ctx) {
    const entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').findMany({
      where: {
        deviceID: "82a34c5123083499",
      },
    });

    for (let i = 0; i < entry.length; i++) {
      ctx.body = entry[i].deviceID;
    }
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
