import cors from 'cors';
import express from 'express';
import mysql from 'promise-mysql';

import config from './config';

mysql
  .createConnection({
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.pass'),
    database: config.get('db.db'),
  })
  .then(sql => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    // REST API
    app.get('/', async (req, res) => {
      res.json('Hello, world!');
    });

    app.listen(config.get('server.port'), () => {
      console.log(`Server listening at http://localhost:${config.get('server.port')}/`);
    });
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
