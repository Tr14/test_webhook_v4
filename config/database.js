module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connector: 'bookshelf',
    connection: {
      host: env('DATABASE_HOST', 'postgres://tructest:Wy22xIVR3Y2WJUr184hDDd5fMYRgefED@dpg-cdr4a6en6mpqj2ddu2b0-a/postgres_sfxp'),
      password: env('DATABASE_PASSWORD', 'Wy22xIVR3Y2WJUr184hDDd5fMYRgefED'),
    }
  }
});