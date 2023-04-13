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

var crypto = require('crypto');

function getAlgorithm(keyBase64) {

  var key = Buffer.from(keyBase64, 'base64');
  switch (key.length) {
    case 16:
      console.log("Key:", key);
      console.log("Key.lenght:", key.length);
      return 'aes-128-cbc';
    case 32:
      console.log("Key:", key);
      console.log("Key.lenght:", key.length);
      return 'aes-256-cbc';

  }

  throw new Error('Invalid key length: ' + key.length);
}


function encrypt(plainText, keyBase64, ivBase64) {

  const key = Buffer.from(keyBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');

  const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64')
  encrypted += cipher.final('base64');
  return encrypted;
};

function decrypt(messagebase64, keyBase64, ivBase64) {

  const key = Buffer.from(keyBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');

  const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
  let decrypted = decipher.update(messagebase64, 'base64');
  decrypted += decipher.final();
  return decrypted;
}

module.exports = {
  async send(ctx) {
    console.log(ctx.request.body);
    console.log(ctx.request.header);
    ctx.body = "AKADIGITAL"

    /*
    var key = crypto.randomBytes(32).toString('base64');
    var iv = crypto.randomBytes(16).toString('base64');
    console.log(key)
    console.log(iv)
    */


    var basic_auth_panel = Buffer.from(ctx.request.header.authorization.split(" ")[1], 'base64').toString();
    console.log("Basic Auth Request:", basic_auth_panel)

    var arr = basic_auth_panel.split(':');
    console.log(arr[1]);

    const basic_auth = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: {
        username: 'akadigital'
      }
    });

    console.log("API User:", basic_auth.password);

    var check = await bcrypt.compare(arr[1], basic_auth.password)
    console.log("Compare:", check);

    if (check == true) {
      //Logging
      let request_urls = ctx.request.url;
      let request_method = ctx.request.method;
      let request_record = ctx.request["x-forwarded-for"];
      // console.log("URL", request_urls);
      // console.log("METHOD", request_method);

      //string
      let data_body = ctx.request.body.data;
      // console.log("data_body:", data_body);
      // console.log("typeof body:", typeof data_body);

      //object
      let data = JSON.parse(data_body);
      // console.log("data:", data);
      // console.log("typeof data:", typeof data);
      // console.log("data length:", data.mkt_prudential.length);

      //loop through response and store data to Lead content-type
      let Email = [];
      let Mobile = [];
      let Full_Name = [];
      let First_Name = [];
      let Last_Name = [];
      let City = [];
      let Zalo_OA_ID = [];
      let Fb_id = [];
      let Gender = [];
      let Address = [];
      let Marriage_Status = [];
      let Age = [];
      let Date_of_birth = [];
      let Zalo_Followed_At = [];
      let Zalo_Unfollowed_At = [];
      let Apptdte = [];
      let Last_Call = [];
      let Zalo_OA_Name = [];
      let Zalo_OA_Status = [];
      let Place_of_Work = [];
      let Year_of_Experience = [];
      let Career = [];
      let Academic_Level = [];
      let Lead_Status = [];
      let Product_Like = [];
      let Call_Result = [];
      let Appointment_Date = [];
      let Appointment_Time = [];
      let Contract = [];
      let Support_Status = [];
      let Lead_Source = [];
      let Submitted_Date = [];
      let journey_name = [];
      let list_name = [];
      for (let i = 0; i < data.mkt_prudential.length; i++) {
        Email = data.mkt_prudential[i].att_params.EMAIL;
        Mobile = data.mkt_prudential[i].att_params.MOBILE;
        Full_Name = data.mkt_prudential[i].att_params.FULL_NAME;
        First_Name = data.mkt_prudential[i].att_params.FIRST_NAME;
        Last_Name = data.mkt_prudential[i].att_params.LAST_NAME;
        City = data.mkt_prudential[i].att_params.CITY;
        Zalo_OA_ID = data.mkt_prudential[i].att_params.ZALO_OA_ID;
        Fb_id = data.mkt_prudential[i].att_params.FB_ID;
        Gender = data.mkt_prudential[i].att_params.GENDER;
        Address = data.mkt_prudential[i].att_params.ADDRESS;
        Marriage_Status = data.mkt_prudential[i].att_params.MARRIAGE_STATUS;
        Age = data.mkt_prudential[i].att_params.AGE;
        Date_of_birth = data.mkt_prudential[i].att_params.DATE_OF_BIRTH;
        Zalo_Followed_At = data.mkt_prudential[i].att_params.ZALO_FOLLOWED_AT;
        Zalo_Unfollowed_At = data.mkt_prudential[i].att_params.ZALO_UNFOLLOWED_AT;
        Apptdte = data.mkt_prudential[i].att_params.APPTDTE;
        Last_Call = data.mkt_prudential[i].att_params.LAST_CALL;
        Zalo_OA_Name = data.mkt_prudential[i].att_params.ZALO_OA_NAME;
        Zalo_OA_Status = data.mkt_prudential[i].att_params.ZALO_OA_STATUS;
        Place_of_Work = data.mkt_prudential[i].att_params.PLACE_OF_WORK;
        Year_of_Experience = data.mkt_prudential[i].att_params.YEAR_OF_EXPERIENCE;
        Career = data.mkt_prudential[i].att_params.CAREER;
        Academic_Level = data.mkt_prudential[i].att_params.ACADEMIC_LEVEL;
        Lead_Status = data.mkt_prudential[i].att_params.LEAD_STATUS;
        Product_Like = data.mkt_prudential[i].att_params.PRODUCT_LIKE;
        Call_Result = data.mkt_prudential[i].att_params.CALL_RESULT;
        Appointment_Date = data.mkt_prudential[i].att_params.APPOINTMENT_DATE;
        Appointment_Time = data.mkt_prudential[i].att_params.APPOINTMENT_DATE;
        Contract = data.mkt_prudential[i].att_params.CONTRACT;
        Support_Status = data.mkt_prudential[i].att_params.SUPPORT_STATUS;
        Lead_Source = data.mkt_prudential[i].att_params.LEAD_SOURCE;
        Submitted_Date = data.mkt_prudential[i].att_params.SUBMITTED_DATE;
        journey_name = data.mkt_prudential[i].custom_params.Journey_Name;
        list_name = data.mkt_prudential[i].custom_params.List_Name;
        // console.log("Email:", Email);
        // console.log("Full Name:", full_name);
        // console.log("Mobile:", Mobile);
        // console.log("Journey Name:", journey_name);
        try {
          if (Mobile != "") {
            let data = JSON.stringify(
              {
                body: {
                  webhook_name: 'AKA_WEBHOOK',
                  journey_name: journey_name,
                  list_name: list_name,
                  attributesExt: {
                    MOBILE: Mobile,
                    EMAIL: Email,
                    FULL_NAME: Full_Name,
                    FIRST_NAME: First_Name,
                    LAST_NAME: Last_Name,
                    CITY: City,
                    ZALO_OA_ID: Zalo_OA_ID,
                    FB_ID: Fb_id,
                    GENDER: Gender,
                    ADDRESS: Address,
                    MARRIAGE_STATUS: Marriage_Status,
                    AGE: Age,
                    DATE_OF_BIRTH: Date_of_birth,
                    ZALO_FOLLOWED_AT: Zalo_Followed_At,
                    ZALO_UNFOLLOWED_AT: Zalo_Unfollowed_At,
                    APPTDTE: Apptdte,
                    LAST_CALL: Last_Call,
                    ZALO_OA_NAME: Zalo_OA_Name,
                    ZALO_OA_STATUS: Zalo_OA_Status,
                    PLACE_OF_WORK: Place_of_Work,
                    YEAR_OF_EXPERIENCE: Year_of_Experience,
                    CAREER: Career,
                    ACADEMIC_LEVEL: Academic_Level,
                    LEAD_STATUS: Lead_Status,
                    PRODUCT_LIKE: Product_Like,
                    APPOINTMENT_DATE: Appointment_Date,
                    APPOINTMENT_DATE: Appointment_Time,
                    CONTRACT: Contract,
                    SUPPORT_STATUS: Support_Status,
                    LEAD_SOURCE: Lead_Source,
                    SUBMITTED_DATE: Submitted_Date
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

            var keyBase64 = "tY07Oxj6CvV/y3u9B3fVxWRCR3FCyK3D88gjLL3y7a0=";
            var ivBase64 = 'UyakdboiHH3Cgn0J7DTiLA==';
            var plainText = data;

            var cipherText = encrypt(plainText, keyBase64, ivBase64);
            var decryptedCipherText = decrypt(cipherText, keyBase64, ivBase64);

            console.log('Algorithm: ' + getAlgorithm(keyBase64));
            console.log('Plaintext: ' + plainText);
            console.log('Ciphertext: ' + cipherText);
            console.log('Decoded Ciphertext: ' + decryptedCipherText);

            const config = {
              method: 'POST',
              url: 'https://ehn-vnlife-uat-az2-hfnhse-premium01.servicebus.windows.net/dev-cdp/messages',
              headers: {
                'Authorization': 'SharedAccessSignature sr=ehn-vnlife-uat-az2-hfnhse-premium01.servicebus.windows.net%2Fdev-cdp&sig=qvNWm8td2zppTt7QaORYfILaZp6RpVjuZvncxu%2FaGV4%3D&se=4778184572&skn=datalake_Rule1_premium',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'ehn-vnlife-uat-az2-hfnhse-premium01.servicebus.windows.net'
              },
              data: cipherText
            }

            let res = await axios(config);
            console.log("EH DATA", res.data);

            let entry = await strapi.db.query('plugin::netcore.netcorelead').create({
              data: {
                Email: Email,
                Mobile: Mobile,
                Full_Name: Full_Name,
                Journey_Name: journey_name,
                List_Name: list_name,
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

        try {
          if (request_record != "") {
            //console.log("RECORD", request_record)

            let logging = await strapi.db.query('plugin::netcore.netcorelog').create({
              data: {
                record: request_record,
                method: request_method,
                url: request_urls,
                email: Email,
                mobile: Mobile
              }
            });

            console.log("DATA:", logging)
          } else {
            console.log("METHOD does not execute")
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
  },

  async emailHandle(ctx) {
    console.log(ctx.request.body);
    console.log(ctx.request.header);

    const entry2 = await strapi.db.query('plugin::netcore.emailhandle').findOne({
      select: ['Email_of_User'],
      where: { Email_of_User: ctx.request.body.EMAIL_GMAIL, Submitted: "Yes" }
    });

    if (entry2) {
      ctx.body = {
        "Full_Name": ctx.request.body.FULL_NAME,
        "Message": "The email " + ctx.request.body.EMAIL_GMAIL + " you receive this form is only allowed to submit once"
      }
    } else {
      const entry = await strapi.db.query('plugin::netcore.emailhandle').create({
        data: {
          Full_Name: ctx.request.body.FULL_NAME,
          Email_User_Submitted: ctx.request.body.EMAIL,
          Email_of_User: ctx.request.body.EMAIL_GMAIL,
          Submitted: "Yes"
        },
      });

      ctx.body = entry;
    }
  },

  async getEmailHandle(ctx) {
    const entry = await strapi.db.query('plugin::netcore.emailhandle').findMany({
      select: ['Email_of_User', 'Full_Name', 'Email_User_Submitted', 'Submitted'],
      where: { Submitted: "Yes" }
    });

    console.log(entry);

    var data = {};

    data['items'] = entry;

    console.log(data);

    ctx.body = data;
  }
};

