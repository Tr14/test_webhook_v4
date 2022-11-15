module.exports = ({ env }) => ({
  client: 'postgres',
  connector: 'bookshelf',
  connection: {
    client: 'postgres',
    host: env('DATABASE_HOST', '127.0.0.1'),
    port: env.int('DATABASE_PORT', 5432),
    database: env('DATABASE_NAME', 'postgres'),
    username: env('DATABASE_USERNAME', 'truc'),
    password: env('DATABASE_PASSWORD', 'xuantruc1499'),
    ssl: env.bool('DATABASE_SSL', false),
  }
});