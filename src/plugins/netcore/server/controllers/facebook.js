'use strict';

module.exports = {
    async send(ctx) {
        console.log(ctx.request.body);
        ctx.body = "Hello from AKADIGITALVN"
    }
};

