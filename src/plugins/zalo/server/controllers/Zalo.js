'use strict';

const _ = require('lodash');

const pkceChallenge = require("pkce-challenge").default;

//const fs = require('fs');
//const path = require('path');

const pluginName = 'zalo';

var cluster = require('cluster');
const os = require('os');
const numCPU = os.cpus().length;

var Queue = require('bull');

let port = strapi.config.get('server.redis.port', '6379');
let host = strapi.config.get('server.redis.host', '127.0.0.1');
let password = strapi.config.get('server.redis.password', '');

var zaloQueue = Queue('zalo_queue', { redis: { port: port, host: host, password: password } });

console.log(`\nZalo queue engine run at ${host}:${port} with ${numCPU} cpus`);

if (cluster.isMaster) {
  for (var i = 0; i < numCPU; i++) {
    cluster.fork();
  }
} else {
  zaloQueue.process(async function (job, complete) {
    if (!strapi.services) {
      complete();
      return;
    }

    let json = job.data;

    let zs = strapi.plugin('zalo').service('Zalo');
    //if (json.type === 'CONTACT') {
    //  await zs.saveToResponsys(json.contact, json.message, json.response);
    //}

    if (json.type === 'SYNC_FOLLOWER') {
      await zs.syncFollowers(json.offset, json.count, json.token, json.ZOAId);
    }

    else if (json.type === 'GET_FOLLOWER') {
      await zs.getZaloFollower(json.userId, json.timestamp, json.token, json.ZOAId);
    }

    else if (json.type === 'UN_FOLLOW') {
      await zs.updateUnfollower(json.userId, json.timestamp, json.token, json.ZOAId);
    }

    else if (json.type === 'HANDLE_MESSAGE') {
      await zs.handleMessage(json.appId, json.userId, json.message, json.timestamp);
    }

    else if (json.type === 'ADD_CONTACT') {
      await zs.addContact(json.userId, json.timestamp, json.mobile, json.token, json.ZOAId);
    }

    else if (json.type === 'SEND_MESSAGE') {
      await zs.sendZaloMessage(json.data);
    }

    else if (json.type === 'HANDLE_READ') {
      await zs.handleRead(json.data);
    }

    else if (json.type === 'SENT_REPORT') {
      //await zs.saveSentReport(json.contact, json.message, json.response);
    }

    else if (json.type === 'RECEIVED_REPORT') {
      //await zs.saveReceivedReport(json.userId, json.messageId, json.timestamp);
    }

    //MUST HAVE: handle next queue item
    complete();
  });
}

module.exports = {
  async getCode(ctx) {
    ctx.body = pkceChallenge();
  },

  async getApps(ctx) {
    console.log('get zalo apps:');
    //console.log(ctx.request.body);   

    let zs = strapi.plugin('zalo').service('Zalo');
    let result = await zs.getApps(ctx.request.body);

    ctx.send(result);
  },

  async addZaloOA(ctx) {
    console.log('addZaloOA:');
    console.log(ctx.request.body);

    let zs = strapi.plugin('zalo').service('Zalo');
    let result = await zs.addZaloOA(ctx.request.body);

    ctx.send(result);
  },

  async index(ctx) {
    console.log('zalo app index:');
    console.log(ctx.request.body);
    ctx.send({ ok: true });
  },

  async callback(ctx) {
    console.log('zalo callback:');
    console.log(ctx.request.body);
    ctx.send({ ok: true });
  },

  async webhook(ctx) {
    console.log('zalo webhook:');
    console.log(ctx.request.body);

    let service = strapi.plugin('zalo').service('Zalo');
    service.webhook(ctx.request.body);

    console.log("SERVICE")
    console.log(service.webhook(ctx.request.body))

    ctx.send({ ok: true });
  },

  async callbackFromZalo(contact, message, response) {
    // zaloQueue.add({
    //   type: 'CONTACT',
    //   contact, 
    //   message, 
    //   response
    // });
  },

  async getFollowers(ctx) {
    //let service = strapi.plugin('zalo').service('Zalo');
    //let json = await service.test(ctx.request.body);

    const entry = await strapi.db.query('plugin::zalo.zalofollower').find({

    });

    ctx.send({ ok: true, data: entry });
  },

  async syncFollowers(ctx) {
    let service = strapi.plugin('zalo').service('Zalo');
    let json = await service.prepareSync(ctx.request.body.id);

    ctx.send(json);
  },

  async send(ctx) {
    console.log('zalo send:');
    console.log(ctx.request.body);

    //let data = {data: '{"mkt_prudential":[{"webhook_name":"Custom App Webhook","msgid":"-1","channel":"custom_activity","event_params":{"activity_source":"other","foreignkey":"84982535185","identity":"84982535185","activity_name":"ZaloOAIdentify","activity_id":103,"ts":210908203134},"custom_params":{"message":"https://www.prudential.com.vn/vi/ke-hoach-bao-ve-va-cham-soc-suc-khoe"},"att_params":{"MOBILE": "84982535185", "ZALO_OA_STATUS":"follow","ZALO_OA_ID":"2343954234106070535"},"journey_name":"Demo Zalo Journey"}]}'};
    //let data = {data: '{"mkt_prudential":[{"webhook_name":"Custom App Webhook","msgid":"-1","channel":"custom_activity","event_params":{"activity_source":"other","foreignkey":"84982535185","identity":"84982535185","activity_name":"ZaloOAIdentify","activity_id":103,"ts":210908203134},"custom_params":{"title":"Prudential xin chào", "subtitle": "Vui lòng kiểm tra thông tin sản phẩm mới nhất tại đây", "image": "https://www.prudential.com.vn/export/sites/prudential-vn/vi/.thu-vien/hinh-anh/san-pham-bao-hiem-nhan-tho/ke-hoach-bao-ve/ke-hoach-bao-ve-hero-666x500.jpg", "url": "https://www.prudential.com.vn/vi/ke-hoach-bao-ve-va-cham-soc-suc-khoe/"},"att_params":{"MOBILE": "84982535185", "ZALO_OA_STATUS":"follow","ZALO_OA_ID":"2343954234106070535"},"journey_name":"Demo Zalo Journey"}]}'};

    let data = ctx.request.body;

    try {
      //local
      //data = JSON.parse(data).data; 

      //live
      data = JSON.parse(data.data);

    } catch (err) {
      data = [];
    }

    data = data['mkt_prudential'];
    data = data && data.length > 0 ? data[0] : null;

    if (data) {
      zaloQueue.add({
        type: 'SEND_MESSAGE',
        data
      });
    }

    ctx.send({ ok: true });
  },

  async callback_syncFollowers(offset, count, token, ZOAId) {
    zaloQueue.add({
      type: 'SYNC_FOLLOWER',
      offset, count, token, ZOAId
    });
  },

  async callback_getFollower(userId, timestamp, token, ZOAId) {
    zaloQueue.add({
      type: 'GET_FOLLOWER',
      userId, timestamp, token, ZOAId
    });
  },

  async callback_unfollow(userId, timestamp, token, ZOAId) {
    zaloQueue.add({
      type: 'UN_FOLLOW',
      userId, timestamp, token, ZOAId
    });
  },

  async callback_handleMesssage(appId, userId, message, timestamp) {
    zaloQueue.add({
      type: 'HANDLE_MESSAGE',
      appId, userId, message, timestamp
    });
  },

  async callback_addContact(userId, timestamp, mobile, token, ZOAId) {
    zaloQueue.add({
      type: 'ADD_CONTACT',
      userId, timestamp, mobile, token, ZOAId
    });
  },

  async callback_handleRead(data) {
    zaloQueue.add({
      type: 'HANDLE_READ',
      data
    });
  },

  async callback_sendMessage(config, contact, message) {
    // zaloQueue.add({
    //   type: 'SEND_MESSAGE',
    //   config, contact, message
    // });
  },

  async callback_saveSentReport(contact, message, response) {
    // zaloQueue.add({
    //   type: 'SENT_REPORT',
    //   contact, message, response
    // });
  },

  async callback_saveReceivedReport(userId, messageId, timestamp) {
    // zaloQueue.add({
    //   type: 'RECEIVED_REPORT',
    //   userId, messageId, timestamp
    // });
  },
};
