module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '66d343acd9de7727c33374ad339af7dd'),
    },
  },
  redis: {
    port: 6379,
    host: 'redis://red-cdr4hch4rebaqdb1mrug:6379',
    password: 'Wy22xIVR3Y2WJUr184hDDd5fMYRgefED'
  },
  app: {
    keys: env.array('APP_KEYS'),
  }
});
