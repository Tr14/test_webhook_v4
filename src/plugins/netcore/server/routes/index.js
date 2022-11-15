module.exports = {
  type: 'content-api',
  routes: [
    {
      method: "GET",
      path: "/getlead",
      handler: "Netcore.getLead",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/findlead",
      handler: "Netcore.findLead",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/editLead",
      handler: "Netcore.editLead",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/deleteLead",
      handler: "Netcore.deleteLead",
      config: {
        policies: []
      }
    },
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
      path: "/webhook.zapiersend/send",
      handler: "Netcore.zapiersend",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/webhook.makesend/send",
      handler: "Netcore.makesend",
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
