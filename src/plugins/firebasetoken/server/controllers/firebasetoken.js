'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    ctx.body = "AKADIGITAL"

    try {
      // Parse a JSON
      var validJSON = null;

      var validJSON = ctx.request.body.json();

      console.log("TRY", validJSON);

    } catch (e) {
      // You can read e for more info
      // Let's assume the error is that we already have parsed the payload
      // So just return that

      console.log("CATCH", validJSON);
    }

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
