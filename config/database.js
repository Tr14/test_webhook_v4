module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connector: 'bookshelf',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'postgres'),
      user: env('DATABASE_USERNAME', 'truc'),
      password: env('DATABASE_PASSWORD', 'xuantruc1499'),
      ssl: env.bool('DATABASE_SSL', false),
    }
  }
});