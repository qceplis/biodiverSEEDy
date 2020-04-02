require("dotenv").config({ path: "../.env" });

const { Pool, Client } = require("pg");

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBCONNECTION,
  database: process.env.DBNAME,
  password: process.env.DBPASS,
  port: process.env.DBPORT
});

module.exports = {
  pool
};
