'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    ctx.body = "AKADIGITAL"

    var validJSON = ctx.request.body;

    var removeQuote = validJSON.replace(/^"(.*)"$/, '$1');

    console.log(removeQuote)

    var data = removeQuote.responsys;

    console.log(data);

    let token = [];
    //let deviceID = [];
    //let deviceName = [];
    //let deviceOS = [];
    //let platform = [];
    //let status = [];

    /*
    for (let i = 0; i < data.responsys.length; i++) {
      token = data.responsys[i].Token;
      //deviceID = data_body[i].DeviceID;
      //deviceName = data_body[i].DeviceName;
      //deviceOS = data_body[i].DeviceOS;
      //platform = data_body[i].Platform;
      //status = data_body[i].Status;

      let entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').create({
        data: {
          //record: "AKA",
          token: token,
          //deviceID: deviceID,
          //deviceName: deviceName,
          //deviceOS: deviceOS,
          //platform: platform,
          //status: status
        }
      });
    };
    */
  },

  async getToken(ctx) {
    ctx.body = "GET TOKEN"
  },
});
