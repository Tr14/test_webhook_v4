const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(env("postgres://tructest:Wy22xIVR3Y2WJUr184hDDd5fMYRgefED@dpg-cdr4a6en6mpqj2ddu2b0-a/postgres_sfxp"));

  return {
    connection: {
      client: "postgres",
      connection: {
        host,
        port,
        database,
        user,
        password,
      },
      debug: false,
    },
  };
};