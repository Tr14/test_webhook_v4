'use strict';

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

};
