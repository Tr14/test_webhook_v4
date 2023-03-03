'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    ctx.body = "AKADIGITAL"

    var validJSON = ctx.request.body;

    var eventstring = validJSON.replace(/^["'](.+(?=["']$))["']$/, '$1');

    console.log(eventstring)

    var data = JSON.parse(eventstring);

    console.log(data);

    let record = [];
    let token = [];
    //let deviceID = [];
    //let deviceName = [];
    //let deviceOS = [];
    //let platform = [];
    //let status = [];

    record = data.DeviceID;
    token = data.Token;

    console.log(record)
    //deviceID = data_body[i].DeviceID;
    //deviceName = data_body[i].DeviceName;
    //deviceOS = data_body[i].DeviceOS;
    //platform = data_body[i].Platform;
    //status = data_body[i].Status;

    let entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').create({
      data: {
        record: record,
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
    ctx.body = "GET TOKEN"

    var data = ctx.response;

    console.log(data);

    const entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').findMany({
      where: {
        record: "82a34c5123083499",
      },
    });
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
