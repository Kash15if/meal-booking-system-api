const sql = require("mssql");

const dbConfig = require("../config/dbConfig");

// new pool creation using environment variable

const pool = new sql.ConnectionPool(dbConfig);

module.exports = pool;
