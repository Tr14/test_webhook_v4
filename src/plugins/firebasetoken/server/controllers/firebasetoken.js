'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    ctx.body = "AKADIGITAL"

    let data_body = ctx.request.body.data;

    let data = JSON.parse(data_body);

    console.log(data)

    let token = [];
    let deviceID = [];
    let deviceName = [];
    let deviceOS = [];
    let platform = [];
    let status = [];

    for (let i = 0; i < data.responsys.length; i++) {
      token = data[i].Token;
      deviceID = data[i].DeviceID;
      deviceName = data[i].DeviceName;
      deviceOS = data[i].DeviceOS;
      platform = data[i].Platform;
      status = data[i].Status;

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
    };
  },

  async getToken(ctx) {
    ctx.body = "GET TOKEN"
  },
});
