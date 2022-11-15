'use strict';

const _ = require('lodash');

const axios = require('axios');
const qs = require('qs');

const pluginName = 'fbm';

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

async function triggerActivity(activity, mobile, timestamp, mid) {
  try {
    let data = JSON.stringify({
      "activityid": activity,
      "uniqueid": "MOBILE",
      "identity": mobile,
      "activity_params": [{
        "mid": mid
      }],
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

async function login() {
  let result;

  try {
    let username = strapi.config.get('plugins.fbm.username', '');
    let password = strapi.config.get('plugins.fbm.password', '');
    let loginURL = strapi.config.get('plugins.fbm.loginURL', '');

    let data = JSON.stringify({
      "username": username,
      "password": password
    });

    var config = {
      method: 'post',
      url: loginURL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    let res = await axios(config);
    result = res.data;

    console.log(res.data);

  } catch (err) {
    console.log('error');
    console.log(err);
  }

  return result;
}

async function send(token, recipient, message) {
  let result;

  try {

    let sendURL = strapi.config.get('plugins.fbm.sendURL', '');

    let data = JSON.stringify({
      recipient: {
        id: recipient
      },
      message: {
        text: message
      }
    });

    var config = {
      method: 'post',
      url: sendURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: data
    };

    let res = await axios(config);
    result = res.data;

    console.log(res.data);

  } catch (err) {
    console.log(err);
  }

  return result;
}

module.exports = {

  async sendMessage(data) {

    const { att_params, custom_params } = data;
    if (!att_params || !custom_params) {
      return;
    }

    //find fb id
    const { FB_ID, MOBILE } = att_params;
    if (!FB_ID) {
      return;
    }

    const { message, template } = custom_params;
    let content;

    //message from marketing automation
    if (message) {
      content = mergeToken(message, att_params);
    }

    //message from this tool
    else if (template) {
      let msgTemplate = await strapi.query('FBMessageTemplate', pluginName).findOne({
        id: template
      }, []);

      if (!msgTemplate) {
        return;
      }

      if (msgTemplate.message) {
        content = mergeToken(msgTemplate.message, att_params);
      }
    }

    let authentication = await login();

    if (authentication && authentication.accessToken) {
      let result = await send(authentication.accessToken, FB_ID, content);

      if (result && result.message_id) {
        await triggerActivity("122", MOBILE, new Date().toISOString(), result.message_id);
      }

    }
  }
};
