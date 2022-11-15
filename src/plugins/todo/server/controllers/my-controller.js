'use strict';

module.exports = {
  send(ctx) {
    ctx.body = strapi
      .plugin('todo')
      .service('myService')
      .getWelcomeMessage();

    console.log(JSON.parse(ctx.request.body.data));
    // let data = JSON.parse(ctx.request.body.data);
    // console.log("Device name:", data.voolatechsmt[0].payload_params.name);
    // console.log("Activity:", data.voolatechsmt[0].event_params.activity_name);
    // console.log("EMAIL:", data.voolatechsmt[0].att_params.EMAIL);
    // console.log("PHONE:", data.voolatechsmt[0].att_params.PHONE);
    // console.log("FULL NAME:", data.voolatechsmt[0].att_params.FULL_NAME);
  },
};
