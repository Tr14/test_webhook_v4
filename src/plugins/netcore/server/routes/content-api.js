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
            method: "POST",
            path: "/customapi",
            handler: "Netcore.customApi",
            config: {
                policies: []
            }
        },
        {
            method: "POST",
            path: "/emailhandle",
            handler: "Netcore.emailHandle",
            config: {
                policies: []
            }
        },
        {
            method: "GET",
            path: "/getemailhandle",
            handler: "Netcore.getEmailHandle",
            config: {
                policies: []
            }
        }
    ]
}
