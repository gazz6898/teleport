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
    multipleStatements: true
  })
  .then(sql => {

    //generate new dummy data here

    //yes, the hubs and vehicles were probably placed in the oceans, we like to think outside the box
    let query = `
    DROP TABLE IF EXISTS Drive;
    DROP TABLE IF EXISTS Trip;
    DROP TABLE IF EXISTS Vehicle;
    DROP TABLE IF EXISTS Hub;
    DROP TABLE IF EXISTS \`User\`;

    CREATE TABLE \`User\` (
      user_id   INTEGER     UNSIGNED NOT NULL AUTO_INCREMENT,
      active        BIT              NOT NULL DEFAULT 1     ,
      is_admin      BIT              NOT NULL DEFAULT 0     ,
      username  VARCHAR(64)          NOT NULL UNIQUE        ,
      pass_hash    CHAR(64)          NOT NULL               ,
      
      PRIMARY KEY (user_id)
    );

    ALTER TABLE \`User\` AUTO_INCREMENT=0;
    
    CREATE TABLE Hub (
      hub_id    INTEGER       UNSIGNED NOT NULL AUTO_INCREMENT,
      latitude  DECIMAL(9, 6)          NOT NULL               ,
      longitude DECIMAL(9, 6)          NOT NULL               ,
      
      CHECK (latitude >= -180 AND latitude <= 180 AND longitude >= -180 AND longitude <= 180),
      
      PRIMARY KEY (hub_id)
    );

    ALTER TABLE Hub AUTO_INCREMENT=1;
    
    CREATE TABLE Vehicle (
      vehicle_id INTEGER       UNSIGNED NOT NULL AUTO_INCREMENT,
      hub_id     INTEGER       UNSIGNED                        ,
      charge     INTEGER(3)    UNSIGNED NOT NULL               ,
      latitude   DECIMAL(9, 6)          NOT NULL               ,
      longitude  DECIMAL(9, 6)          NOT NULL               ,
      updated_at DATETIME               NOT NULL DEFAULT NOW() ,
    
      CHECK (latitude >= -180 AND latitude <= 180 AND longitude >= -180 AND longitude <= 180),
    
      PRIMARY KEY (vehicle_id),
      FOREIGN KEY (hub_id) REFERENCES Hub(hub_id)
    );

    ALTER TABLE Vehicle AUTO_INCREMENT=1;
    
    CREATE TABLE Trip (
      trip_id   INTEGER        UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id   INTEGER        UNSIGNED NOT NULL               ,
      price     DECIMAL(10, 2) UNSIGNED NOT NULL               ,
      issued_at DATETIME                NOT NULL DEFAULT NOW() ,
    
      PRIMARY KEY (trip_id),
      FOREIGN KEY (user_id) REFERENCES \`User\`(user_id)
        ON DELETE CASCADE
    );

    ALTER TABLE Trip AUTO_INCREMENT=1;
    
    CREATE TABLE Drive (
      drive_id   INTEGER       UNSIGNED NOT NULL AUTO_INCREMENT,
      trip_id    INTEGER       UNSIGNED NOT NULL               ,
      vehicle_id INTEGER       UNSIGNED                        ,
      start_lat  DECIMAL(9, 6)          NOT NULL               ,
      start_lon  DECIMAL(9, 6)          NOT NULL               ,
      end_lat    DECIMAL(9, 6)          NOT NULL               ,
      end_lon    DECIMAL(9, 6)          NOT NULL               ,
    
      CHECK (start_lat >= -180 AND start_lat <= 180 AND start_lon >= -180 AND start_lon <= 180),
      CHECK (end_lat >= -180 AND end_lat <= 180 AND end_lon >= -180 AND end_lon <= 180),
      
      PRIMARY KEY (drive_id),
      FOREIGN KEY (trip_id) REFERENCES Trip(trip_id)
        ON DELETE CASCADE,
      FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id)
        ON DELETE SET NULL
    );

    ALTER TABLE Drive AUTO_INCREMENT=1;

    INSERT INTO \`User\` (username, pass_hash)
      VALUES
      ('test-user@example.com', '008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601'),
      ('alice@aol.com', '008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601'),
      ('bob@gmail.com', '008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601'),
      ('candice@yahoo.com', '008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601'),
      ('david@dailymail.com', '008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601'),
      ('evan@ymail.com', '008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601');
    INSERT INTO Hub (hub_id, latitude, longitude)
      VALUES
      (1, 89.309, 23.223),
      (2, -15.090, -37.238),
      (3, 134.392, -93.552),
      (4, -164.332, 11.298);
    INSERT INTO Vehicle (vehicle_id, hub_id, charge, latitude, longitude)
      VALUES
      (1, NULL, 27, 15.330, -93.239),
      (2, 4, 2, -164.332, 11.298),
      (3, 2, 87, -15.090, -37.238),
      (4, NULL, 64, 162.725, -145.876);
    INSERT INTO Trip (trip_id, user_id, price, issued_at)
      VALUES
      (1, 2, 29.99, "2020-05-10 02:36:54.480"),
      (2, 1, 19.99, "2020-04-16 20:42:19.354"),
      (3, 1, 16.25, "2020-04-24 23:58:45.198"),
      (4, 4, 99.95, "2020-05-09 16:43:13.679"),
      (5, 3, 12.50, "2020-06-04 08:02:08.436"),
      (6, 2, 25.00, "2020-05-27 11:17:26.015");
    INSERT INTO Drive (drive_id, trip_id, vehicle_id, start_lat, start_lon, end_lat, end_lon)
      VALUES
      (1, 1, 3, 52.236, -12.542, 52.297, -12.523),
      (2, 1, 4, 52.297, -12.523, 52.387, -12.466),
      (3, 2, 1, 23.017, 67.194, 23.024, 67.227),
      (4, 3, 3, 97.455, -0.198, 97.666, -0.736),
      (5, 4, 2, 111.417, 35.648, 111.316, 35.652),
      (6, 4, NULL, 111.316, 35.652, 111.227, 35.645),
      (7, 5, 1, -152.700, 173.994, -152.796, 174.215),
      (8, 5, NULL, -152.796, 174.215, -152.905, 174.500),
      (9, 6, 2, 179.431, 27.409, 0.093, 26.994);`;

    console.log('Attempting the following query:', query);
    sql.query(query).catch(error => console.log(error));

    return sql;
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

    /**
     * Query a table
     */
    app.post('/query', async (req, res) => {
      console.log('==================================================\nPOST\n/query');
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



