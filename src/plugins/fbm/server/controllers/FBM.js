'use strict';

const axios = require('axios');

const pluginName = 'fbm';

var cluster = require('cluster');
const os = require('os');
const numCPU = os.cpus().length;

var Queue = require('bull');

let port = strapi.config.get('server.redis.port', '6379');
let host = strapi.config.get('server.redis.host', '127.0.0.1');
let password = strapi.config.get('server.redis.password', '');

var fbmQueue = Queue('fbm_queue', { redis: { port: port, host: host, password: password } });

console.log(`\nFB queue engine run at ${host}:${port} with ${numCPU} cpus`);

if (cluster.isMaster) {
  for (var i = 0; i < numCPU; i++) {
    cluster.fork();
  }
} else {
  fbmQueue.process(async function (job, complete) {
    if (!strapi.services) {
      complete();
      return;
    }

    let json = job.data;

    let service = strapi
      .plugin('fbm')
      .service('FBM');

    if (json.type === 'SEND_MESSAGE') {
      await service.sendMessage(json.data);
    }

    // else if (json.type === 'HANDLE_READ') {
    //   await zs.handleRead(json.data);
    // }

    // else if (json.type === 'SENT_REPORT') {
    //   //await zs.saveSentReport(json.contact, json.message, json.response);
    // }

    // else if (json.type === 'RECEIVED_REPORT') {
    //   //await zs.saveReceivedReport(json.userId, json.messageId, json.timestamp);
    // }

    //MUST HAVE: handle next queue item
    complete();
  });
}


module.exports = {
  /*
  async get_webhook(ctx) {
    console.log('fbm get webhook:');
    console.log(ctx.request.query);

    let challenge = ctx.request.query['hub.challenge'];
    //let service = strapi.plugins[pluginName].services.zalo;
    //service.webhook(ctx.request.body);
    ctx.send(challenge);
  },

  async post_webhook(ctx) {
    console.log('fbm post webhook:');
    console.log(ctx.request.body);
    ctx.body = "Hello from facebook webhook"

    //let challenge = ctx.request.query['hub.challenge'];
    //let service = strapi.plugins[pluginName].services.zalo;
    //service.webhook(ctx.request.body);
    ctx.send({ ok: true });
  },

  async send(ctx) {
    console.log('facebook send:');
    console.log(ctx.request.body);

    //local
    //let data = {data: '{"mkt_prudential":[{"webhook_name":"Custom App Webhook","msgid":"-1","channel":"custom_activity","event_params":{"activity_source":"other","foreignkey":"84982535185","identity":"84982535185","activity_name":"ZaloOAIdentify","activity_id":103,"ts":210908203134},"custom_params":{"message":"https://www.prudential.com.vn/vi/ke-hoach-bao-ve-va-cham-soc-suc-khoe"},"att_params":{"MOBILE": "84982535185", "ZALO_OA_STATUS":"follow","ZALO_OA_ID":"2343954234106070535"},"journey_name":"Demo Zalo Journey"}]}'};
    //let data = {data: '{"mkt_prudential":[{"webhook_name":"Custom App Webhook","msgid":"-1","channel":"custom_activity","event_params":{"activity_source":"other","foreignkey":"84982535185","identity":"84982535185","activity_name":"ZaloOAIdentify","activity_id":103,"ts":210908203134},"custom_params":{"message": "Xin chào bạn"},"att_params":{"MOBILE": "84982535185", "FB_ID":"2343954234106070535"},"journey_name":"Demo Zalo Journey"}]}'};

    //live
    let data = ctx.request.body;

    try {
      data = JSON.parse(data.data);

    } catch (err) {
      data = [];
    }

    data = data['mkt_prudential'];
    data = data && data.length > 0 ? data[0] : null;

    if (data) {
      fbmQueue.add({
        type: 'SEND_MESSAGE',
        data
      });
    }

    ctx.send({ ok: true });
  },
  */

  async homepage(ctx) {
    console.log(ctx.request.body)
    var url = ctx.request.url
    const regex = /(?<=\?code=).*/gm
    if (url.match(regex) == null) {
      let challenge = ctx.request.query['hub.challenge'];
      ctx.send(challenge);
    }
    if (url.match(regex) != null) {
      let result = url.match(regex).toString()
      let client_id = "843916146887327"
      let redirect_uri = "https://dev.akadigital.net/api/fbm/homepage"
      let client_secret = "dcd3e07276cae9b514a404dc8c83e8ef"
      ctx.body = "Get Facebook authorization code successfully"

      //Get user token
      const config_usertoken = {
        method: 'GET',
        url: `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${result}`,
        headers: {},
        data: {}
      }

      let res_usertoken = await axios(config_usertoken)
      let user_access_token = res_usertoken.data.access_token
      console.log("\u001b[1;32m" + "USER_ACCESS_TOKEN:" + "\u001b[0m", user_access_token);

      let pageID = "akadigital.net"
      console.log("\u001b[1;32m" + "PAGE_ID:" + "\u001b[0m", pageID);

      //Get page token
      let config_pagetoken = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/${pageID}?fields=access_token&access_token=${user_access_token}`,
        headers: {},
        data: {}
      };

      let res_pagetoken = await axios(config_pagetoken)
      let pageToken = res_pagetoken.data.access_token
      console.log("\u001b[1;32m" + "PAGE_TOKEN:" + "\u001b[0m", pageToken);

      //subscribe feed
      let subscribe_app = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/${pageID}/subscribed_apps?subscribed_fields=feed&access_token=${pageToken}`,
        headers: {},
        data: {}
      };

      let res_subscribe_app = await axios(subscribe_app)
      let subscribe_feed = res_subscribe_app.data.success
      console.log("\u001b[1;32m" + "FEED SUBSCRIBED:" + "\u001b[0m", subscribe_feed);

      //subscribe leadgen
      let subscribe_app2 = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/${pageID}/subscribed_apps?subscribed_fields=leadgen&access_token=${pageToken}`,
        headers: {},
        data: {}
      };

      let res_subscribe_app2 = await axios(subscribe_app2)
      let subscribe_leadgen = res_subscribe_app2.data.success
      console.log("\u001b[1;32m" + "LEADGEN SUBSCRIBED:" + "\u001b[0m", subscribe_leadgen);


      //get app all permission
      let app_permission = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/${pageID}/subscribed_apps?access_token=${pageToken}`,
        headers: {},
        data: {}
      };

      let res_app_permission = await axios(app_permission)
      let app_all_permission = res_app_permission.data.data[0].subscribed_fields
      console.log("\u001b[1;32m" + "ALL PERMISSION:" + "\u001b[0m", app_all_permission);

      //get responsys from id
      let form_id = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/v18.0/${pageID}/leadgen_forms?access_token=${pageToken}`,
        headers: {},
        data: {}
      };

      let res_form_id = await axios(form_id)
      let get_form_id = res_form_id.data.data[0].id
      console.log("\u001b[1;32m" + "RESPONSYS FORM ID:" + "\u001b[0m", get_form_id);

      var today_date = new Date();
      today_date = today_date.getTime();

      /*
      //get responsys from id
      let lead_data = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://www.facebook.com/ads/lead_gen/export_csv/?id=${get_form_id}&type=form&from_date=1482698431&to_date=${today_date}`,
        headers: {},
        data: {}
      };

      let res_lead_data = await axios(lead_data)
      let get_lead_data = res_lead_data.data
      console.log("\u001b[1;32m" + "LEAD ID:" + "\u001b[0m", get_lead_data);
          */
    }
    //https://www.facebook.com/v8.0/dialog/oauth?client_id=843916146887327&redirect_uri=https://dev.akadigital.net/api/fbm/homepage
  },

};
