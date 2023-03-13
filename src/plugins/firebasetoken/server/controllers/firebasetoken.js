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
    let packageName = [];

    deviceID = data.DeviceID;
    token = data.Token;
    deviceName = data.DeviceName;
    deviceOS = data.DeviceOS;
    platform = data.Platform;
    packageName = data.PackageName;

    //only one token for each device
    const count = await strapi.db.query('plugin::firebasetoken.firebasetoken').count({
      where: {
        deviceID: deviceID,
      },
    });

    const count2 = await strapi.db.query('plugin::firebasetoken.firebasetoken').count({
      where: {
        packageName: packageName,
      },
    });

    const record = await strapi.db.query('plugin::firebasetoken.firebasetoken').findMany({
      where: {
        status: "Dead",
      },
    });

    let status = [];

    console.log(record);

    //add token
    if (count == 0) {
      let entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').create({
        data: {
          deviceID: deviceID,
          token: token,
          deviceOS: deviceOS,
          deviceName: deviceName,
          platform: platform,
          packageName: packageName,
          status: "Live"
        }
      });
    } else if (count2 == 0) {
      let entry = await strapi.db.query('plugin::firebasetoken.firebasetoken').create({
        data: {
          deviceID: deviceID,
          token: token,
          deviceOS: deviceOS,
          deviceName: deviceName,
          platform: platform,
          packageName: packageName,
          status: "Live"
        }
      });
    } else {
      console.log("Does not match any cases")
    }

    //update status and token
    for (let i = 0; i < record.length; i++) {
      status = record[i].status;
    };

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
        packageName: packageName,
        status: "Live"
      },
    });
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
    let packageName = [];

    var validJSON = ctx.request.body;

    //validate string
    var eventstring = validJSON.replace(/^["'](.+(?=["']$))["']$/, '$1');

    var data = JSON.parse(eventstring);

    userIdentified = data.userIdentified;
    deviceID = data.DeviceID;
    packageName = data.PackageName;


    await strapi.db.query('plugin::firebasetoken.firebasetoken').updateMany({
      where: {
        deviceID: deviceID,
        packageName: packageName,
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

    //validate string
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
  },

  async postNotiMessage(ctx) {
    ctx.body = "Notification is saved to message center successfully"

    var validJSON = ctx.request.body;

    var eventstring = validJSON.replace(/^["'](.+(?=["']$))["']$/, '$1');

    var data = JSON.parse(eventstring);

    let subject = [];
    let deeplinkURL = [];
    let iconURL = [];
    let message = [];
    let richMessageHTML = [];
    let sentTime = [];
    let deviceID = [];
    let packageName = [];

    subject = data.Subject;
    deeplinkURL = data.DeeplinkURL;
    deviceID = data.DeviceID;
    packageName = data.PackageName;
    sentTime = new Date(parseInt(data.SentTime));
    iconURL = data.IconURL;
    message = data.MessageContent;
    richMessageHTML = data.RichContent;

    let entry = await strapi.db.query('plugin::firebasetoken.messagecenter').create({
      data: {
        subject: subject,
        deeplinkURL: deeplinkURL,
        deviceID: deviceID,
        packageName: packageName,
        iconURL: iconURL,
        message: message,
        richMessageHTML: richMessageHTML,
        sentTime: sentTime
      }
    });
  }
});
