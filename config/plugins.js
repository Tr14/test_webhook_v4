module.exports = {
    'Zalo': {
        enabled: true,
        resolve: './src/plugins/zalo',
        messageRules: ['#', "*", "?"],
        url: "https://openapi.zalo.me/v2.0/oa",
    },

    'Facebook': {
        enabled: true,
        resolve: './src/plugins/fbm',
        loginURL: "https://portal-uat.prudential.com.vn/pulse-lead-corporate/auth/login",
        sendURL: "https://portal-uat.prudential.com.vn/pulse-lead-corporate/message/send-msg",
        username: "pulseleaduat",
        password: "Prudential01@"
    },

    'Netcore': {
        enabled: true,
        resolve: './src/plugins/netcore'
    },

    'Firebase': {
        enabled: true,
        resolve: './src/plugins/firebasetoken'
    },

    'mParticle': {
        enabled: true,
        resolve: './src/plugins/mparticle'
    },
}