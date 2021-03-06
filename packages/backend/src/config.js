import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  jwt: {
    secret: {
      doc: "The JWT secret key. It should be hidden, but this is a dummy app, so it doesn't matter.",
      format: '*',
      default: 'd9e1670f33ebb340be5c18d6f81730b97c89e68819971ab0c43ddb9cae8942873659c418ff7116bba36d761649d7c19074bba6fb3ab6e1bea9951b236d2950fc',
      env: 'JWT_SECRET',
    },
  },
  db: {
    host: {
      doc: 'MySQL host name/IP',
      format: '*',
      default: 'localhost',
      env: 'DB_HOST',
    },
    user: {
      doc: 'The user for MySQL.',
      format: '*',
      default: 'root',
      env: 'DB_USER',
      arg: 'db_user',
    },
    pass: {
      doc: 'The password for MySQL.',
      format: '*',
      default: 'root',
      env: 'DB_PASS',
      arg: 'db_pass',
    },
    db: {
      doc: 'The database to use in MySQL.',
      format: '*',
      default: 'db',
      env: 'DB_DB',
      arg: 'db_db',
    },
  },
  server: {
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 4000,
      env: 'PORT',
      arg: 'port',
    },
  },
});

export default config;
