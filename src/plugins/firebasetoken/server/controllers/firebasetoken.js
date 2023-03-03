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

    console.log(entry);

    var data = JSON.stringify(entry);

    ctx.body = data[0].deviceID;
  },

  async updateRecord(ctx) {
    await strapi.db.query('plugin::firebasetoken.firebasetoken').updateMany({
      where: {
        price: 20,
      },
      data: {
        price: 18,
      },
    });
  }
});
