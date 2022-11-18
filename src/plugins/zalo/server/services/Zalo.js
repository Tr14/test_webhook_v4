'use strict';

const _ = require('lodash');

const axios = require('axios');
const qs = require('qs');

const pluginName = 'zalo';

function formatNumber(n) {
  return n > 9 ? n : ("0" + n);
}

function formatDate(d) {
  return d.getFullYear() + "-" + formatNumber(d.getMonth() + 1) + "-" + formatNumber(d.getDate());
  // + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
}

function mergeToken(message, tokens) {
  let msg = message;

  for (let key in tokens) {
    let find = '{' + key + '}';
    let re = new RegExp(find, 'g');
    msg = msg.replace(re, tokens[key]);
  }

  return msg;
}

function getRandomPhoneNumber() {
  const firstNumber = ['03', '05', '07', '08', '09'];
  return firstNumber[Math.floor(Math.random() * firstNumber.length)] + Math.floor(Math.random() * 100000000);
}

async function addContact(mobile, display_name, user_id, followedAt, status, unFollowedAt) {
  try {
    let data = qs.stringify({ 'data': '{"MOBILE": "' + mobile + '", "ZALO_OA_NAME": "' + display_name + '", "ZALO_OA_STATUS": "' + status + '", "ZALO_OA_ID": "' + user_id + '", "ZALO_FOLLOWED_AT": "' + followedAt + '", "ZALO_UNFOLLOWED_AT": "' + unFollowedAt + '"}' });

    let config = {
      method: 'post',
      url: 'http://api.netcoresmartech.com/apiv2?type=contact&activity=add&apikey=8adf223f5fe1c3b2c590d7f48da6b916',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    //send to zalo
    let res = await axios(config);
    console.log(res.data);

  } catch (err) {
    console.log(err);
  }
}

async function triggerActivity(activity, mobile, timestamp) {
  try {
    let data = JSON.stringify({
      "activityid": activity,
      "uniqueid": "MOBILE",
      "identity": mobile,
      "activity_params": [{}],
      "timestamp": timestamp
    });

    var config = {
      method: 'post',
      url: 'https://api.netcoresmartech.com/v1/activity/singleactivity/ADGMOT35CHFLVDHBJNIG50K96BG9MQQALRQNNS79KODULCNC8TSG',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 8adf223f5fe1c3b2c590d7f48da6b916'
      },
      data: data
    };

    let res = await axios(config);
    console.log(res.data);

  } catch (err) {
    console.log(err);
  }
}


module.exports = {

  async getApps() {
    let entry = await strapi.db.query('plugin::zalo.zalooa').find({});

    return { ok: true, data: entry };
  },

  async addZaloOA(data) {
    try {

      //T4f2GV8K511xIa1D_18H47bEHLUnJ50JSabXIxPlM58rJ5DQvt98NXbr6rdXOXnv3Y8TLjXy56K0H3b5taTt65vaGGMNS4OBTKzk4eXXGqj1PqOMdtfnI5bmM6MJA7LQ571KKCrU05erIbSBpM9wDmnCRntPJrmR6KK8EDrABJ9S43uJYnGJ470l6J-I4JmzPGuwOhGn2rjW7nfmeX0_O7us972g0ontMpXzGTeATMjQCtDodJbYVrXjS5wOING6Jdmw5OHV4p1m7p8DWmGL1tiC5mEj2283JLUmRMDfzmaL60

      //config 
      const config = {
        method: 'GET',
        url: 'https://openapi.zalo.me/v2.0/oa/getoa?access_token=' + data.token,
        headers: { "Content-Type": "application/json" }
      };

      //send to zalo
      let res = await axios(config);
      if (res.data.error !== 0) {
        return { ok: false, message: res.data.message };
      }

      let dataOA = res.data.data;

      let fields = ['name', 'description', 'avatar', 'cover', 'oa_id', 'is_verified'];
      let json = { token: data.token };

      for (let key in dataOA) {
        if (fields.indexOf(key) !== -1) {
          json[key] = dataOA[key];
        }
      }

      let entry = await strapi.db.query('plugin::zalo.zalooa').create(json);

      if (entry) {
        let controller = strapi.controller('plugin::zalo.Zalo');
        controller.callback_syncFollowers(0, 50, data.token, entry.id);
      }

      return { ok: entry ? true : false, message: "", data: entry };

    } catch (err) {
      console.log(err);
    }

    return { ok: false, message: "error_occured" };
  },

  async webhook(data) {

    const { event_name } = data;

    //follow
    if (event_name === 'follow') {
      try {

        // sample data
        // {
        //   "app_id": "3206567425609033798",
        //   "oa_id": "579745863508352884",
        //   "user_id_by_app": "1923626015168953374",
        //   "event_name": "follow",
        //   "timestamp": "1630985527582",
        //   "source": "testing_webhook", //oa_profile
        //   "follower": {
        //     "id": "8381381219617247797"
        //   }
        // }

        let entry = await strapi.db.query('plugin::zalo.zalooa').findOne({
          app_id: data.app_id
        }, []);

        console.log('ENTRY')
        console.log('entry')

        if (entry) {
          let controller = strapi.controller('plugin::zalo.Zalo');
          controller.callback_getFollower(data.follower.id, data.timestamp, entry.token, entry.id);

          console.log("CONTROLLER")
          console.log(controller.callback_getFollower(data.follower.id, data.timestamp, entry.token, entry.id))
        }

      } catch (err) {
        console.log(err);
      }
    }

    //unfollow
    else if (event_name === 'unfollow') {
      // sample data
      // {
      //   app_id: '3206567425609033798',
      //   oa_id: '579745863508352884',
      //   user_id_by_app: '1923626015168953374',
      //   event_name: 'unfollow',
      //   timestamp: '1631000222702',
      //   source: 'testing_webhook', //unfollow
      //   follower: { id: '8381381219617247797' }
      // }


      try {
        let entry = await strapi.db.query('plugin::zalo.zalooa').findOne({
          app_id: data.app_id
        });

        if (entry) {
          let controller = strapi.controller('plugin::zalo.Zalo');
          controller.callback_unfollow(data.follower.id, data.timestamp, entry.token, entry.id);
        }

      } catch (err) {
        console.log(err);
      }
    }

    else if (event_name === 'user_send_text') {
      // sample data      
      // {
      //   event_name: 'user_send_text',
      //   app_id: '1452469966392287716',
      //   sender: { id: '2343954234106070535' },
      //   recipient: { id: '2731914566897854906' },
      //   message: { text: '#sdt 0982535185', msg_id: '884ed83abff728ab71e4' },
      //   timestamp: '1631003632884',
      //   reorder_id: '1631003632884'
      // }
      try {

        //quick check
        const zaloConfig = strapi.config.get('plugins.zalo', {});
        let text = data.message.text;
        let check = false;

        console.log('zaloConfig.messageRules');
        console.log(zaloConfig.messageRules);


        for (let i = 0; i < zaloConfig.messageRules.length; i++) {
          if (text.indexOf(zaloConfig.messageRules[i]) === 0) {
            check = true;
            break;
          }
        }

        if (check === false) {
          return;
        }

        console.log('send to queue: callback_handleMesssage')

        //deep check by message rule
        let controller = strapi.controller('plugin::zalo.Zalo');
        controller.callback_handleMesssage(data.app_id, data.sender.id, data.message.text, data.timestamp);


        // let mobile = data.message.text;
        // mobile = mobile.substr(4, mobile.length).trim();

        // let isMobile = mobile.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{8,14}$/g) !== null;

        // if (isMobile) {
        //   let entry = await strapi.db.query('ZaloOA', pluginName).findOne({
        //     app_id: data.app_id
        //   }, []);

        //   if (entry) {
        //     let controller = strapi.controller('plugin::zalo.Zalo');
        //     controller.callback_addContact(data.sender.id, data.timestamp, mobile, entry.token, entry.id);
        //   }
        // }

      } catch (err) {
        console.log(err);
      }
    }

    else if (event_name === 'user_seen_message') {

      let obj = {
        user_id: data.recipient.id,
        app_id: data.app_id,
        messages: data.message.msg_ids,
        timestamp: data.timestamp
      };

      let controller = strapi.controller('plugin::zalo.Zalo');
      controller.callback_handleRead(obj);
    }
  },

  async handleMessage(app_id, user_id, message, timestamp) {
    let entry = await strapi.db.query('plugin::zalo.zalooa').findOne({
      app_id: app_id
    }, []);

    console.log(entry);

    if (!entry) {
      return;
    }

    let pattern = message.indexOf(' ');
    let value = message.substr(pattern + 1, message.length);

    pattern = message.substr(0, pattern);

    let rule = await strapi.db.query('plugin::zalo.zalomessagerule').findOne({
      rule: pattern,
      zalo_oa: entry.id
    }, []);

    console.log(rule);


    if (!rule) {
      return;
    }

    if (rule.field && rule.field === 'MOBILE') {

      console.log(value);

      let controller = strapi.controller('plugin::zalo.Zalo');
      controller.callback_addContact(user_id, timestamp, value, entry.token, entry.id);
    }

    if (rule.activity && rule.activity !== "103") {
      let follower = await strapi.db.query('plugin::zalo.zalofollower').findOne({
        user_id: user_id,
        zalo_oa: entry.id
      }, []);

      console.log(follower);

      if (follower && follower.mobile_number) {
        await triggerActivity(rule.activity, follower.mobile_number, new Date(parseInt(timestamp)).toISOString());
      }

      //console.log(rule.field, 'trigger activity', rule.activity);
      //await triggerActivity(rule.activity, mobile, new Date(parseInt(timestamp)).toISOString()); 
    }
  },

  async handleRead(data) {

    let reports = await strapi.db.query('plugin::zalo.zaloreport').find({
      user_id: data.user_id,
      message_id_in: data.messages,
      //seen: false,
      //zalo_follower: entry.id
    }, []);

    for (let i = 0; i < reports.length; i++) {
      await triggerActivity("105", reports[i].mobile, new Date(parseInt(data.timestamp)).toISOString());
    }

    return true;
  },

  async addContact(user_id, timestamp, mobile, token, ZOAId) {

    try {
      let entry = await strapi.db.query('plugin::zalo.zalofollower').findOne({
        user_id: user_id
      }, []);

      if (!entry) {
        return;
      } else {
        entry = await strapi.db.query('plugin::zalo.zalofollower').update({
          id: entry.id
        }, {
          mobile_number: mobile
        }, []);
      }

      let followedAt = new Date(parseInt(timestamp));
      followedAt = formatDate(followedAt);

      let data = qs.stringify({ 'data': '{"MOBILE": "' + mobile + '", "ZALO_OA_NAME": "' + entry.display_name + '", "ZALO_OA_STATUS": "follow", "ZALO_OA_ID": "' + user_id + '", "ZALO_FOLLOWED_AT": "' + followedAt + '"}' });

      let config = {
        method: 'post',
        url: 'http://api.netcoresmartech.com/apiv2?type=contact&activity=add&apikey=8adf223f5fe1c3b2c590d7f48da6b916',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };

      //send to zalo
      let res = await axios(config);
      console.log(res.data);

      await triggerActivity("103", mobile, new Date(parseInt(timestamp)).toISOString());

    } catch (err) {
      console.log(err);
    }
  },

  async prepareSync(id) {
    let entry = await strapi.db.query('plugin::zalo.zalooa').findOne({
      id: id
    }, []);

    if (entry) {
      let controller = strapi.controller('plugin::zalo.Zalo');
      controller.callback_syncFollowers(0, 50, entry.token, entry.id);
    }

    return { ok: true };
  },

  async syncFollowers(offset, count, token, ZOAId) {
    try {
      const config = {
        method: 'get',
        url: 'https://openapi.zalo.me/v2.0/oa/getfollowers?access_token=' + token,
        headers: { "Content-Type": "application/json" },
        data: {
          offset: offset,
          count: count
        }
      };

      //send to zalo
      let res = await axios(config);

      if (res.data.error === 0 && res.data.data) {

        let total = res.data.data.total;

        console.log(offset, count, total);

        let controller = strapi.controller('plugin::zalo.Zalo');

        let followers = res.data.data.followers;

        for (let i = 0; i < followers.length; i++) {
          controller.callback_getFollower(followers[i].user_id, null, token, ZOAId);
        }

        if (offset < total) {
          controller.callback_syncFollowers(offset + 50, 50, token, ZOAId);
        }
      }
    } catch (err) {
      console.log(err);
    }

    return { ok: true }
  },

  async getZaloFollower(user_id, timestamp, token, ZOAId) {
    try {
      const config = {
        method: 'get',
        url: 'https://openapi.zalo.me/v2.0/oa/getprofile?access_token=' + token,
        headers: { "Content-Type": "application/json" },
        data: {
          user_id
        }
      };

      //send to zalo
      let res = await axios(config);

      if (res.data.error === 0 && res.data.data) {
        //console.log(res.data.data);

        //find in db
        let entry = await strapi.db.query('plugin::zalo.zalofollower').findOne({
          user_id: user_id
        }, []);

        let data = _.cloneDeep(res.data.data);

        data.status = 'follow';
        data.zalo_oa = ZOAId;

        //random
        data.mobile_number = getRandomPhoneNumber();

        if (data.birth_date > 0) {
          data.birth_date = new Date(data.birth_date);
        } else {
          delete data.birth_date;
        }

        if (timestamp) {
          data.followed_at = new Date(parseInt(timestamp));
        }

        //upsert to db
        if (!entry) {
          entry = await strapi.db.query('plugin::zalo.zalofollower').create(data);
        } else {
          entry = await strapi.db.query('plugin::zalo.zalofollower').update({
            user_id: user_id
          }, data);
        }

        //check entry       
        if (entry) {
          await addContact(entry.mobile_number, entry.display_name, entry.user_id, entry.followed_at ? entry.followed_at : "", "follow", "");
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  async updateUnfollower(user_id, timestamp, token, ZOAId) {
    try {
      let entry = await strapi.db.query('plugin::zalo.zalofollower').findOne({
        user_id: user_id
      });

      if (entry) {
        entry = await strapi.db.query('plugin::zalo.zalofollower').update({
          user_id: user_id
        }, {
          status: 'unfollow',
          unfollowed_at: new Date(parseInt(timestamp))
        });

        //update to marketing automation
        await addContact(entry.mobile_number, entry.display_name, entry.user_id, entry.followed_at ? entry.followed_at : "", "unfollow", entry.unfollowed_at);

      }

    } catch (err) {
      console.log(err);
    }
  },

  async sendZaloMessage(data) {

    const { att_params, custom_params } = data;

    console.log(att_params, custom_params);

    if (!att_params || !custom_params) {
      return;
    }

    //find zalo id
    const { ZALO_OA_ID } = att_params;
    const { message, template, title, subtitle, image, url } = custom_params;

    console.log(ZALO_OA_ID);

    if (!ZALO_OA_ID) {
      return;
    }

    let content;

    if (message) {
      let msg = mergeToken(message, att_params);
      content = { "text": msg };
    }

    else if (template) {

      let msgTemplate = await strapi.db.query('plugin::zalo.zalomessagetemplate').findOne({
        id: template
      }, []);

      if (!msgTemplate) {
        return;
      }

      if (msgTemplate.message) {
        let msg = mergeToken(msgTemplate.message, att_params);
        content = { "text": msg };
      }

      else if (msgTemplate.title && msgTemplate.subtitle && msgTemplate.image && msgTemplate.url) {

        let title = mergeToken(msgTemplate.title, att_params);
        let subtitle = mergeToken(msgTemplate.subtitle, att_params);

        content = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "list",
              "elements": [
                {
                  "title": title,
                  "subtitle": subtitle,
                  "image_url": msgTemplate.image,
                  "default_action": {
                    "type": "oa.open.url",
                    "url": msgTemplate.url
                  }
                }
              ]
            }
          }
        }
      }
    }

    else if (title && subtitle && image && url) {
      content = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "list",
            "elements": [
              {
                "title": title,
                "subtitle": subtitle,
                "image_url": image,
                "default_action": {
                  "type": "oa.open.url",
                  "url": url
                }
              }
            ]
          }
        }
      }
    }

    console.log(content);

    if (!content) {
      return;
    }

    let entry = await strapi.db.query('plugin::zalo.zalofollower').findOne({
      user_id: ZALO_OA_ID
    }, ['zalo_oa']);

    console.log(entry);

    if (!entry) {
      return;
    }

    try {
      const config = {
        method: 'post',
        url: 'https://openapi.zalo.me/v2.0/oa/message?access_token=' + entry.zalo_oa.token,
        headers: { "Content-Type": "application/json" },
        data: {
          recipient: {
            user_id: ZALO_OA_ID
          },
          message: content
        }
      };

      //send to zalo
      let res = await axios(config);
      console.log(res.data);

      if (entry.mobile_number && res.data.error === 0) {
        //store to db
        let report = await strapi.db.query('plugin::zalo.zaloreport').create({
          user_id: ZALO_OA_ID,
          message_id: res.data.data.message_id,
          seen: false,
          zalo_follower: entry.id,
          mobile: entry.mobile_number
        });

        //trigger ZaloOAMessageSent      
        await triggerActivity("104", entry.mobile_number, new Date().toISOString());
      }

    } catch (err) {
      console.log(err);
    }
  }
};
