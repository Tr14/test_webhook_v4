"use strict";

const config = require("@strapi/strapi/lib/core/registries/config");

module.exports = {
    type: 'content-api',
    routes: [
        {
            method: "POST",
            path: "/token/send",
            handler: "FirebaseToken.sendToken",
            config: {
                policies: []
            }
        },
        {
            method: "GET",
            path: "/token/get",
            handler: "FirebaseToken.getToken",
            config: {
                policies: []
            }
        },
        {
            method: "POST",
            path: "/record/update",
            handler: "FirebaseToken.updateRecord",
            config: {
                policies: []
            }
        },
    ]
}
