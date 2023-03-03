'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    ctx.body = "AKADIGITAL"

    var validJSON = ctx.request.body;

    var eventstring = validJSON.replace(/^["'](.+(?=["']$))["']$/, '$1');

    console.log(eventstring)

    var data = JSON.parse(eventstring);

    console.log(data);

    let mobile = [];
    let token = [];
    //let deviceID = [];
    //let deviceName = [];
    //let deviceOS = [];
    //let platform = [];
    //let status = [];

    mobile = data.Mobile;
    token = data.Token;
    //deviceID = data_body[i].DeviceID;
    //deviceName = data_body[i].DeviceName;
    //deviceOS = data_body[i].DeviceOS;
    //platform = data_body[i].Platform;
    //status = data_body[i].Status;

    let entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').create({
      data: {
        record: mobile,
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

    var data = ctx.body.response;

    console.log(data);

    const entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').findMany({
      where: {
        record: mobile,
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
