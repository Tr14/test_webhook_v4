module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env("PUBLIC_URL", "https://aka-webhook.onrender.com"),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '66d343acd9de7727c33374ad339af7dd'),
    },
  },
  redis: {
    host: 'redis://red-cdr4hch4rebaqdb1mrug:6379'
  },
  app: {
    keys: env.array('APP_KEYS'),
  }
});
