module.exports = ({ env }) => ({
  connection: {
    connector: 'bookshelf',
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'postgres'),
      username: env('DATABASE_USERNAME', 'truc'),
      password: env('DATABASE_PASSWORD', '!Vola@1204@'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    debug: false,
  },
});