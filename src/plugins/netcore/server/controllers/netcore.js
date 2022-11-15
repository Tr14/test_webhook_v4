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
    console.log(ctx.request.body);
    console.log(ctx.request.header);

    var basic_auth_panel = Buffer.from(ctx.request.header.authorization.split(" ")[1], 'base64').toString();
    console.log("Basic Auth Request:", basic_auth_panel)

    var arr = basic_auth_panel.split(':');
    console.log(arr[1]);

    const basic_auth = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: {
        username: 'sniperxt'
      }
    });

    console.log("API User:", basic_auth.password);

    var check = await bcrypt.compare(arr[1], basic_auth.password)
    console.log("Compare:", check);

    if (check == true) {
      ctx.body = "Welcome to AKA Netcore Webhook"
      //Logging
      let request_urls = ctx.request.url;
      let request_method = ctx.request.method;
      let request_record = "Lmaoez@gmail.com";
      console.log("URL", request_urls);
      console.log("METHOD", request_method);

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

      //string
      let data_body = ctx.request.body.data;
      console.log("data_body:", data_body);
      console.log("typeof body:", typeof data_body);

      //object
      let data = JSON.parse(data_body);
      console.log("data:", data);
      console.log("typeof data:", typeof data);
      console.log("data length:", data.voolatechsmt.length);

      //loop through response and store data to Lead content-type
      let email = [];
      let full_name = [];
      let phone = [];
      let activity_name = [];
      let journey_name = [];
      for (let i = 0; i < data.voolatechsmt.length; i++) {
        email = data.voolatechsmt[i].att_params.EMAIL;
        full_name = data.voolatechsmt[i].att_params.FULL_NAME;
        phone = data.voolatechsmt[i].att_params.PHONE;
        activity_name = data.voolatechsmt[i].event_params.activity_name;
        journey_name = data.voolatechsmt[i].journey_name;

        console.log("Email:", email);
        console.log("Full Name:", full_name);
        console.log("Phone:", phone);
        console.log("Activity Name:", activity_name);
        console.log("Journey Name:", journey_name);

        try {
          if (email != "") {
            let entry = await strapi.db.query('plugin::netcore.netcorelead').create({
              data: {
                Email: email,
                Phone: phone,
                Full_Name: full_name,
                Activity_Name: activity_name,
                Journey_Name: journey_name,
                isGet: false,
                Source: "Netcore Smartech"
              }
            });

            console.log("DATA:", entry)
          } else {
            console.log("EMAIL does not exist")
          }
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      ctx.body = "User is not exist"
    }

    //console.log("ARRAY EMAIL", data.voolatechsmt);
    // console.log("Device name:", data.voolatechsmt[0].payload_params.name);
    // console.log("Activity:", data.voolatechsmt[0].event_params.activity_name);
    //console.log("EMAIL:", data.voolatechsmt[0].att_params.EMAIL);
    // console.log("PHONE:", data.voolatechsmt[0].att_params.PHONE);
    //console.log("FULL NAME:", data.voolatechsmt[0].att_params.FULL_NAME);
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
