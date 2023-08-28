"use strict";

const config = require("@strapi/strapi/lib/core/registries/config");

module.exports = {
    type: 'content-api',
    routes: [
        {
            method: "GET",
            path: "/webhook/get",
            handler: "FBM.get_webhook",
            config: {
                policies: [],
                description: "Webhook for Facebook Messenger"
            }
        },
        {
            method: "POST",
            path: "/webhook/post",
            handler: "FBM.post_webhook",
            config: {
                policies: [],
                description: "Webhook for Facebook Messenger"
            }
        },
        {
            method: "POST",
            path: "/send",
            handler: "FBM.send",
            config: {
                policies: [],
                description: "Send Facebook message"
            }
        }
    ]
}

