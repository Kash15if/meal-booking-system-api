require("dotenv").config();

const dbConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.HOST,
  database: process.env.DATABASENAME,
  requestTimeout: 0,
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: false,
  },
};

module.exports = dbConfig;
