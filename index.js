const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//importing db-connection query
const pool = require("./models/dbCon");
pool
  .connect()
  .then((row) => {
    console.log("db is connected :", row._connected);
  })
  .catch((err) => {
    throw err;
  });

//for cors error
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Access-Control-Allow-Headers"],
};
app.use(cors({ origin: "*" }));

const adminRoutes = require("./routes/admin");
const clientRoutes = require("./routes/client");
app.use("/admin", adminRoutes);
app.use("/client", clientRoutes);

app.listen(5000);
