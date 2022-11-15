"use strict";

const config = require("@strapi/strapi/lib/core/registries/config");

module.exports = {
    routes: [
        {
            method: "GET",
            path: "/webhook",
            handler: "FBM.get_webhook",
            config: {
                policies: [],
                description: "Webhook for Facebook Messenger"
            }
        },
        {
            method: "POST",
            path: "/webhook",
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

