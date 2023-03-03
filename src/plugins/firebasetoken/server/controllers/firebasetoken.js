'use strict';

module.exports = ({ strapi }) => ({
  async sendToken(ctx) {
    ctx.body = "AKADIGITAL"

    var validJSON = `[  
    [32.361346650846805,50.90932315437885],
    [32.36743646734031,50.95189517586323],
    [32.35467638118774,50.95876163094135],
    [32.342494619322636,50.904516635824166],
    [32.36279664436138,50.90039676277729],
    [32.380194752587755,50.899023471761666],
    [32.3648265962154,50.91481631844135],
    [32.361346650846805,50.90932315437885]
    ]`;

    console.log(validJSON)

    var data = JSON.parse(validJSON);

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
