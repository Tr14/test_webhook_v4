const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

// Send and retrieve some values
await client.set('key', 'node redis');
const value = await client.get('key');

console.log("found value: ", value)

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
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
