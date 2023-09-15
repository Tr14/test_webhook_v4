"use strict";

const config = require("@strapi/strapi/lib/core/registries/config");

module.exports = {
    type: 'content-api',
    routes: [
        {
            method: "POST",
            path: "/webhook/send",
            handler: "mParticle.send",
            config: {
                policies: []
            }
        },
    ]
}
