import cors from 'cors';
import express from 'express';
import mysql from 'promise-mysql';

import jwt from 'jsonwebtoken';

import config from './config';

mysql
  .createConnection({
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.pass'),
    database: config.get('db.db'),
    multipleStatements: true,
  })
  .then(async sql => {
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

    INSERT INTO \`User\` (is_admin, username, pass_hash)
      VALUES
      (1, 'test-user@example.com', '71b6c1d53832f789a7f2435a7c629245fa3761ad8487775ebf4957330213a706'),
      (0, 'alice@aol.com', '71b6c1d53832f789a7f2435a7c629245fa3761ad8487775ebf4957330213a706'),
      (0, 'bob@gmail.com', '71b6c1d53832f789a7f2435a7c629245fa3761ad8487775ebf4957330213a706'),
      (0, 'candice@yahoo.com', '71b6c1d53832f789a7f2435a7c629245fa3761ad8487775ebf4957330213a706'),
      (0, 'david@dailymail.com', '71b6c1d53832f789a7f2435a7c629245fa3761ad8487775ebf4957330213a706'),
      (0, 'evan@ymail.com', '71b6c1d53832f789a7f2435a7c629245fa3761ad8487775ebf4957330213a706');
    INSERT INTO Hub (hub_id, latitude, longitude)
      VALUES
      (1, 43.013375, -83.715638),
      (2, 43.003685, -83.714538),
      (3, 43.030275, -83.725138),
      (4, 44.013215, -83.705514);
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

    await sql.query(query).catch(error => console.log(error));

    await sql.end();

    return mysql.createConnection({
      host: config.get('db.host'),
      user: config.get('db.user'),
      password: config.get('db.pass'),
      database: config.get('db.db'),
      typeCast: (field, useDefaultTypeCasting) => {
        if (field.type === 'BIT' && field.length === 1) {
          return field.buffer()[0] === 1;
        }

        return useDefaultTypeCasting();
      },
    });
  })
  .then(sql => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    /** @type {express.RequestHandler} */
    const authorize =
      ({ admin = false } = {}) =>
      (req, res, next) => {
        const auth = req.headers['authorization'];
        if (!auth || !/^Bearer /.test(auth)) {
          res.sendStatus(401);
        } else {
          try {
            const token = auth.substring(7);
            const decoded = jwt.verify(token, config.get('jwt.secret'));

            if (admin && !decoded.admin) {
              res.sendStatus(401);
            }

            next();
          } catch (error) {
            console.log(error);
            res.sendStatus(401);
          }
        }
      };

    // REST API
    /**
     * Get info for the Ride screen
     */
    app.post('/ride', authorize({ admin: false }), async (req, res) => {
      const hubs = await getTable(sql, 'Hub');
      const vehicles = await getTable(sql, 'Vehicle');
      res.json({ hubs, vehicles });
    });

    // REST API
    /**
     * Get info for the Ride screen
     */
    app.post('/trips/:user', authorize({ admin: false }), async (req, res) => {
      const { user } = req.params;
      const trips = await sql.query(`SELECT * FROM Drive AS D LEFT OUTER JOIN Trip AS T ON (D.trip_id = T.trip_id) WHERE T.user_id = ?;`, [user]);
      res.json(trips);
    });

    /**
     * Query a table
     */
    app.post('/query', authorize({ admin: true }), async (req, res) => {
      const query = await getTable(sql, req.body.tableName, req.body.columns);
      res.json(query);
    });

    /**
     * Insert into a table
     */
    app.post('/insert', authorize({ admin: true }), async (req, res) => {
      const { columns, tableName, values } = req.body;
      console.log(req.body);
      if ((!columns, !tableName || !values)) {
        res.sendStatus(401);
      } else {
        const q = `INSERT INTO ${tableName} ${
          columns.length ? `(${columns.join(',')})` : ''
        } VALUES (?)`;
        console.log(q);
        await sql
          .query(
            q,
            values.map(v => columns.map(c => v[c]))
          )
          .catch(err => console.log(err));
        res.json({ done: true });
      }
    });

    /**
     * Delete from a table
     */
    app.post('/delete', authorize({ admin: true }), async (req, res) => {
      const { column, tableName, values } = req.body;
      if (!column || !tableName || !values) {
        res.sendStatus(401);
      } else {
        await sql.query(`DELETE FROM ${tableName} WHERE ${column} IN (?)`, values);
        res.json({ done: true });
      }
    });

    app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        res.json({ error: new Error('Email and password must be provided.') });
      }

      try {
        const [user] = await sql.query(
          'SELECT user_id, username, pass_hash, is_admin FROM `User` WHERE username = ? AND pass_hash = ?',
          [email, password]
        );

        if (user) {
          res.json({
            user,
            token: jwt.sign({ email, admin: user.is_admin }, config.get('jwt.secret'), {
              expiresIn: '1h',
            }),
          });
        } else {
          res.json({ error: new Error('The user could not be authenticated.') });
        }
      } catch (error) {
        console.log(error);
        res.json({ error });
      }
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
function getTable(sql, tableName, columns = []) {
  let queryString = `SELECT ${columns.length ? columns.join(', ') : '*'} FROM ${tableName}`;

  return sql.query(queryString).catch(error => console.log(error));
}
