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

      console.log('==================================================\nGET\n/');
      console.log(req.body);
      console.log('--------------------------------------------------');

      res.json('Hello, world!');
      console.log('==================================================');
    });

    app.post('/query', async (req, res) => {
      console.log('==================================================\nPOST\n/');
      console.log(req.body);
      console.log('--------------------------------------------------');
      let query = await getTable(sql, req.body.tableName, req.body.columns);
      console.log(query);
      res.json(query);
      console.log('==================================================');
    });

    app.post('/login', async (req, res) => {
      
      console.log('==================================================\nPOST\n/login');
      console.log(req.body);
      console.log('--------------------------------------------------');

      let userQuery = await sql.query('SELECT * FROM `User` WHERE username = ?', [req.body.email]).catch(error => console.log(error));

      if(!userQuery.length) {
        //user not found
        console.log('user not found\n', {email: req.body.email});

      } else if(userQuery[0].pass_hash != req.body.password) {
        //incorrect password
        console.log('incorrect password\n', {email: req.body.email, passhash: userQuery[0].pass_hash, attempthash: req.body.password});

      } else {
        //correct password
        console.log('correct password\n', {email: req.body.email, passhash: req.body.password});
      }

      if(userQuery.length) console.log(userQuery[0].username);

      res.json(userQuery);
      //res.json(req.body);

      console.log('==================================================');
    });

    app.listen(config.get('server.port'), () => {
      console.log(`Server listening at http://localhost:${config.get('server.port')}/`);
    });
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });

 /**
  * This function returns an array of rows with the given column names from the given table
  * @param {mysql.Connection} sql 
  * @param {string} tableName 
  * @param {string[]} columns 
  * @returns {any[]}
  */
  function getTable(sql, tableName, columns) {

    let queryString = `SELECT ${columns.length ? columns.join(', ') : '*'} FROM ${tableName}`;

    return sql.query(queryString).catch(error => console.log(error));
  }



