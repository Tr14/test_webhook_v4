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
    ctx.body = "Lmao"

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
      console.log("data length:", data.mkt_prudential.length);

      //loop through response and store data to Lead content-type
      let email = [];
      let full_name = [];
      let mobile = [];
      let journey_name = [];
      for (let i = 0; i < data.mkt_prudential.length; i++) {
        email = data.mkt_prudential[i].att_params.EMAIL;
        full_name = data.mkt_prudential[i].att_params.FULL_NAME;
        mobile = data.mkt_prudential[i].att_params.MOBILE;
        journey_name = data.mkt_prudential[i].journey_name;

        console.log("Email:", email);
        console.log("Full Name:", full_name);
        console.log("Phone:", mobile);
        console.log("Journey Name:", journey_name);

        try {
          if (mobile != "") {
            let entry = await strapi.db.query('plugin::netcore.netcorelead').create({
              data: {
                Email: email,
                Phone: mobile,
                Full_Name: full_name,
                Journey_Name: journey_name,
                isGet: false,
                Source: "Netcore Smartech"
              }
            });

            let data = qs.stringify(
              {
                body: {
                  webhook_name: 'AKA_CUSTOM_APP',
                  attributesExt: {
                    MOBILE: mobile,
                    EMAIL: email,
                    FULL_NAME: full_name
                  }
                },
                authenRequestForm: {
                  signatureDocuments: [{
                    name: "PS71743503/OeJpQzvc0o5_screen shot 2022-06-14 at 094453.png",
                    url: "https://pru-api-nprd.prudential.com.vn/azurestorage/1-0-0/pulseforops"
                  }],
                  authFlag: true
                },
                documents: [{
                  name: "PS71743503/OeJpQzvc0o5_screen shot 2022-06-14 at 094453.png",
                  url: "https://pru-api-nprd.prudential.com.vn/azurestorage/1-0-0/pulseforops"
                }],
                authenOption: "ATTACH_REQUEST_FORM",
                primaryPolicyNo: "71743503",
                clientId: "47859152",
                officeCode: "BMT",
                createdDate: "2022-11-16T06:59:23.984Z",
                isCCE: false
              }
            );

            const config = {
              method: 'POST',
              url: 'https://ehn-vnlife-uat-az2-hfnhse-premium01.servicebus.windows.net/dev-cdp/messages',
              headers: {
                Authorization: 'SharedAccessSignature sr=ehn-vnlife-uat-az2-hfnhse-premium01.servicebus.windows.net%2Fdev-cdp&sig=qvNWm8td2zppTt7QaORYfILaZp6RpVjuZvncxu%2FaGV4%3D&se=4778184572&skn=datalake_Rule1_premium',
                'Content-Type': 'application/x-www-form-urlencoded',
                Host: 'ehn-vnlife-uat-az2-hfnhse-premium01.servicebus.windows.net'
              },
              data: data
            }

            let res = await axios(config);
            console.log(res.data);

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
  },

  async customApi(ctx) {
    ctx.body = strapi
      .plugin('netcore')
      .service('NetcoreServices')
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

