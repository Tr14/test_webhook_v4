module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 9000),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '66d343acd9de7727c33374ad339af7dd'),
    },
  },
  redis: {
    port: 6379,
    host: '127.0.0.1',
    password: '!Vola@2021@'
  },
});
