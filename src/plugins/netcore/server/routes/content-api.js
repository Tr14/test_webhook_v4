"use strict";

const config = require("@strapi/strapi/lib/core/registries/config");

module.exports = {
    type: 'content-api',
    routes: [
        {
            method: "POST",
            path: "/webhook/send",
            handler: "Netcore.send",
            config: {
                policies: []
            }
        },
        {
            method: "GET",
            path: "/customapi",
            handler: "Netcore.customApi",
            config: {
                policies: []
            }
        }
    ]
}
