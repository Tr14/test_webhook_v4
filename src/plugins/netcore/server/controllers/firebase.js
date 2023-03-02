'use strict';
const bcrypt = require("bcryptjs");

const pluginName = 'firebase';

var cluster = require('cluster');
const os = require('os');
const numCPU = os.cpus().length;

var Queue = require('bull');

let port = strapi.config.get('server.redis.port', '6379');
let host = strapi.config.get('server.redis.host', '127.0.0.1');
let password = strapi.config.get('server.redis.password', '');

var firebaseQueue = Queue('firebase_queue', { redis: { port: port, host: host, password: password } });

console.log(`\nFirebase queue engine run at ${host}:${port} with ${numCPU} cpus`);

if (cluster.isMaster) {
    for (var i = 0; i < numCPU; i++) {
        cluster.fork();
    }
} else {
    firebaseQueue.process(async function (job, complete) {
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
    async sendFBToken(ctx) {

    }
};

