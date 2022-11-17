module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connector: 'bookshelf',
    connection: {
      host: env('DATABASE_HOST', 'dpg-cdr4a6en6mpqj2ddu2b0-a'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'postgres_sfxp'),
      user: env('DATABASE_USERNAME', 'tructest'),
      password: env('DATABASE_PASSWORD', 'Wy22xIVR3Y2WJUr184hDDd5fMYRgefED'),
      ssl: env.bool('DATABASE_SSL', false),
    }
  }
});