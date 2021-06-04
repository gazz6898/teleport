import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
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
