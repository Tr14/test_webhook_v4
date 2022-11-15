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
  send: async ctx => {

    ctx.body = "Welcome to AKA Netcore Webhook"

    console.log("Data 1", ctx.request.body.data);

    console.log("Data 2", ctx.request.body);

    //Logging
    console.log(ctx.request.header);
    let request_urls = ctx.request.url;
    let request_method = ctx.request.method;
    let request_record = ctx.request.header['x-forwarded-for'];
    let request_agent = ctx.request.header['user-agent'];
    var datetime = new Date();
    console.log("URL", request_urls);
    console.log("METHOD", request_method);

    try {
      if (request_record != "") {
        console.log("RECORD", request_record)

        let logging = await strapi.query('NetcoreLogs', pluginName).create({
          data: {
            record: request_record,
            method: request_method,
            url: request_urls,
            agent: request_agent,
            created_date: datetime
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
    let phone = [];
    let journey_name = [];
    for (let i = 0; i < data.mkt_prudential.length; i++) {
      email = data.mkt_prudential[i].att_params.EMAIL;
      full_name = data.mkt_prudential[i].att_params.FULL_NAME;
      phone = data.mkt_prudential[i].att_params.MOBILE;
      journey_name = data.mkt_prudential[i].journey_name;

      console.log("Email:", email);
      console.log("Full Name:", full_name);
      console.log("Phone:", phone);
      console.log("Activity Name:", activity_name);
      console.log("Journey Name:", journey_name);

      try {
        if (email != "") {
          let entry = await strapi.query('NetcoreLeads', pluginName).create({
            data: {
              Email: email,
              Phone: phone,
              Full_Name: full_name,
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
  },

  editLead: async ctx => {
    ctx.body = "Edit Lead Success"

    const update = await strapi.query('NetcoreLeads', pluginName).updateMany({
      where: { isGet: true },
      data: {
        isGet: false,
      },
    });

    return update;
  },

  getLead: async ctx => {
    ctx.body = "Get Lead Success"

    //Logging
    let request_urls = ctx.request.url;
    let request_method = ctx.request.method;
    let request_record = ctx.request.header['x-forwarded-for'];
    let request_agent = ctx.request.header['user-agent'];
    var datetime = new Date();
    console.log("URL", request_urls);
    console.log("METHOD", request_method);
    console.log("Header", ctx.request.header)

    try {
      if (request_record != "") {
        console.log("RECORD", request_record)

        let logging = await strapi.query('NetcoreLogs', pluginName).create({
          record: request_record,
          method: request_method,
          url: request_urls,
          agent: request_agent,
          created_date: datetime
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


    //count record with isGet = false
    const count = await strapi.query('NetcoreLeads', pluginName).findWithCount({
      select: ['Email', 'Full_Name', 'Activity_Name', 'Journey_Name'],
      where: { isGet: false },
    });

    console.log("Count:", count[1]);

    let limit = 3;

    let length = Math.ceil(count[1] / limit);

    console.log("Length:", length);

    var entry = [];

    for (let i = 0; i <= length; i++) {
      const entries = await strapi.query('NetcoreLeads', pluginName).findMany({
        select: ['Email', 'Full_Name', 'Activity_Name', 'Journey_Name', 'isGet'],
        where: { isGet: false },
        orderBy: { Source: 'Netcore Smartech' },
        populate: { category: true },
        limit: limit,
        offset: i * limit,
      });

      entry.push(entries);
    }

    ctx.body = entry;

    console.log("Data before update:", entry);

    //update record to isGet = true after data is get and then we can delete those record that is get
    if (statusCode == 200) {
      const update = await strapi.query('NetcoreLeads', pluginName).updateMany({
        where: { isGet: false },
        data: {
          isGet: true,
        },
      });

      console.log(update);

      return update;
    }

    console.log("Data after update:", entry);

    return entry;
  },

  deleteLead: async ctx => {
    console.log("Delete Lead", ctx.request.url);

    ctx.body = "Delete Lead Success"
    const deleteLead = await strapi.query('NetcoreLeads', pluginName).deleteMany({
      where: {
        isGet: true,
      },
    });

    return deleteLead;
  },

  customApi: async ctx => {
    //Logging
    var request_urls = ctx.request.url;
    var request_method = ctx.request.method;
    var request_record = ctx.request.header['x-forwarded-for'];
    let request_agent = ctx.request.header['user-agent'];
    var datetime = new Date();
    console.log("URL", request_urls);
    console.log("METHOD", request_method);
    console.log("RECORD", request_record);
    console.log("Header", ctx.request.header);

    ctx.body = ctx.request.header;

    try {
      if (request_record != "") {
        let logging = await strapi.query('NetcoreLogs', pluginName).create({
          record: request_record,
          method: request_method,
          url: request_urls,
          agent: request_agent,
          created_date: datetime
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
  },

  findLead: async ctx => {
    console.log(ctx.request.body);
    console.log(ctx.request.header);

    var basic_auth_panel = Buffer.from(ctx.request.header.authorization.split(" ")[1], 'base64').toString();
    console.log("Basic Auth Request:", basic_auth_panel)

    var arr = basic_auth_panel.split(':');
    console.log(arr[1]);

    const basic_auth = await strapi.query('plugins::users-permissions.user').findOne({
      where: {
        username: 'xuantruc'
      }
    });

    console.log("API User:", basic_auth.password);

    var check = await bcrypt.compare(arr[1], basic_auth.password)
    console.log("Compare:", check);

    if (check == true) {
      ctx.body = "Find Lead Success"

      const entries = await strapi.query('NetcoreLeads', pluginName).findMany({
        select: ['Email', 'Full_Name', 'Activity_Name', 'Journey_Name', 'isGet'],
        where: { isGet: true },
        orderBy: { Source: 'Netcore Smartech' },
        populate: { category: true },
      });

      var key = "items";
      var obj = entries;

      ctx.body = { [key]: obj };

      console.log(ctx.body)
    } else {
      ctx.body = "User does not exist"
    }
  },

  zapiersend: async ctx => {
    console.log(ctx.request.body);
    console.log(ctx.request.header);

    var basic_auth_panel = Buffer.from(ctx.request.header.authorization.split(" ")[1], 'base64').toString();
    console.log("Basic Auth Request:", basic_auth_panel)

    var arr = basic_auth_panel.split(':');
    console.log(arr[1]);

    const basic_auth = await strapi.query('plugins::users-permissions.user').findOne({
      where: {
        username: 'xuantruc'
      }
    });

    console.log("API User:", basic_auth.password);

    var check = await bcrypt.compare(arr[1], basic_auth.password)
    console.log("Compare:", check);

    if (check == true) {
      ctx.body = "Welcome to AKA Zappier Webhook"

      let data = ctx.request.body;
      console.log("data_body:", data);
      console.log("typeof body:", typeof data);
      console.log("Data Length:", ctx.request.body.length);

      //loop through response and store data to Lead content-type

      var email = data.email;
      var full_name = data.full_name;
      var form_name = data.form_name;
      var page_name = data.page_name;

      console.log("email:", email);
      console.log("full_name:", full_name);
      console.log("form_name:", form_name);
      console.log("page_name:", page_name);

      try {
        if (email != "") {
          let entry = await strapi.db.query('plugins::netcore.facebooklead').create({
            data: {
              Email: email,
              Full_Name: full_name,
              Form_Name: form_name,
              Page_Name: page_name,
              isGet: false,
              Source: "Facebook"
            }
          });

          console.log("DATA:", entry)
        } else {
          console.log("EMAIL does not exist")
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      ctx.body = "User is not exist"
    }
  },

  makesend: async ctx => {
    ctx.body = "Welcome to AKA Make Webhook"

    console.log(ctx.request.body);
  },
};
