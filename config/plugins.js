module.exports = {
    /*
    'zalo': {
        messageRules: ['#', "*", "?"],
        url: "https://openapi.zalo.me/v2.0/oa",
    },
    */

    'fbm': {
        enable: true,
        resolve: './src/plugins/fbm',
        loginURL: "https://portal-uat.prudential.com.vn/pulse-lead-corporate/auth/login",
        sendURL: "https://portal-uat.prudential.com.vn/pulse-lead-corporate/message/send-msg",
        username: "pulseleaduat",
        password: "Prudential01@"
    },

    'netcore': {
        enabled: true,
        resolve: './src/plugins/netcore'
    },
}