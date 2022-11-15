'use strict';
const bcrypt = require("bcryptjs");

const pluginName = 'netcore';

var cluster = require('cluster');
const os = require('os');
const numCPU = os.cpus().length;

var Queue = require('bull');

let port = strapi.config.get('server.redis.port', '6379');
let host = strapi.config.get('server.redis.host', '127.0.0.1');
let password = strapi.config.get('server.redis.password', '');

var netcoreQueue = Queue('netcore_queue', { redis: { port: port, host: host, password: password } });

console.log(`\nNetcore queue engine run at ${host}:${port} with ${numCPU} cpus`);

if (cluster.isMaster) {
  for (var i = 0; i < numCPU; i++) {
    cluster.fork();
  }
} else {
  netcoreQueue.process(async function (job, complete) {
    if (!strapi.services) {
      complete();
      return;
    }

    let json = job.data;

    let service = strapi.plugins[pluginName].services[pluginName];

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

const axios = require('axios');

module.exports = {
  async send(ctx) {

  },

  async customApi(ctx) {
    ctx.body = strapi
      .plugin('todo')
      .service('myServiceWebhook')
      .getResultLogging();

    //Logging
    let request_urls = ctx.request.url;
    let request_method = ctx.request.method;
    let request_record = "Lmaoez@gmail.com";
    console.log("URL", request_urls);
    console.log("METHOD", request_method);
    console.log("Header", ctx.request.header)

    ctx.body = ctx.request.header;

    try {
      if (request_record != "") {
        console.log("RECORD", request_record)

        let logging = await strapi.db.query('plugin::netcore.netcorelog').create({
          data: {
            record: request_record,
            method: request_method,
            url: request_urls
          }
        });

        console.log("DATA:", logging)
      } else {
        console.log("METHOD does not execute")
      }
    } catch (error) {
      console.error(error);
    }

    let statusCode = ctx.response.status;
    console.log(statusCode);
    console.log("typeof statusCode:", typeof statusCode);
  }
};
