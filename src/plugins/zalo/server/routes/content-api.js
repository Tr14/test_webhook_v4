"use strict";

const config = require("@strapi/strapi/lib/core/registries/config");

module.exports = {
    "routes": [
        {
            method: "GET",
            path: "/getCode",
            handler: "Zalo.getCode",
            config: {
                policies: [],
                description: "Get code"
            }
        },
        {
            method: "GET",
            path: "/apps",
            handler: "Zalo.getApps",
            config: {
                policies: [],
                description: "Get zalo app"
            }
        },
        {
            method: "POST",
            path: "/add",
            handler: "Zalo.addZaloOA",
            config: {
                policies: [],
                description: "Add Zalo OA information"
            }
        },
        {
            method: "GET",
            path: "/admin/followers",
            handler: "Zalo.getFollowers",
            config: {
                policies: [],
                description: "Get zalo follower"
            }
        },
        {
            method: "POST",
            path: "/sync",
            handler: "Zalo.syncFollowers",
            config: {
                policies: [],
                description: "Sync zalo follower"
            }
        },
        {
            method: "POST",
            path: "/callback",
            handler: "Zalo.callback",
            config: {
                policies: [],
                description: "Callback for zalo"
            }
        },
        {
            method: "POST",
            path: "/webhook",
            handler: "Zalo.webhook",
            config: {
                policies: [],
                description: "Webhook for zalo"
            }
        },
        {
            method: "POST",
            path: "/send",
            handler: "Zalo.send",
            config: {
                policies: [],
                description: "Send message via zalo"
            }
        }
    ]
}

