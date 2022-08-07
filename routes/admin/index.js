const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

const sql = require("mssql");

//importing db-connection query
const pool = require("../../models/dbCon"); //importing db-pool for query

router.get("/test", async (req, res) => {
  const out = await pool.query("SELECT [Date] ,[Time] ,[Menu] FROM [Menu]");
  res.send(out.recordset);
});

//admin login
router.post("/login", async (req, res) => {
  let userCreds = req.body.user;

  try {
    let dbData = await pool
      .request()
      .input("user1", sql.Int, userCreds.user)
      .query(
        "SELECT [admin] ,[password] ,[name] FROM [admins] where [admin] = @user1"
      );

    let foundUser = dbData.recordset[0];

    if (foundUser) {
      let submittedPass = userCreds.password;
      let storedPass = foundUser.pass;

      // const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

      if (submittedPass === storedPass) {
        let admin = foundUser.admin;
        let name = foundUser.name;
        var token = jwt.sign({ admin }, process.env.AUTHTOKEN);

        res.status(200);
        res.send({
          auth: true,
          token: token,
          admin: admin,
          name: name,
        });
      } else {
        res.status(404);
        res.send("Wrong Password, Type correct password and login again");
      }
    } else {
      // let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
      // await bcrypt.compare(req.body.password, fakePass);

      res.status(404);
      res.send("No Such user exists");
    }
  } catch (error) {
    console.log(error);
    res.status(405);
    res.send("Internal server error");
  }
});

// ------------------- manage menu api-------------------------------
//read
router.get("/menu", async (req, res) => {});
//add
router.post("/menu", async (req, res) => {});
//update
router.put("/menu", async (req, res) => {});
//delete
router.delete("/menu", async (req, res) => {});

// ------------------- manage user api-------------------------------
//read
router.get("/user", async (req, res) => {});
//add
router.post("/user", async (req, res) => {});
//update
router.put("/user", async (req, res) => {});
//delete
router.delete("/user", async (req, res) => {});

// --------------------Dashboard Api--------------------
//get only
router.get("/dashboard", async (req, res) => {});

// --------------------All Meals Api--------------------
//get only
router.get("/allmeals", async (req, res) => {});

// ------------------- resolve conflict api-------------------------------
//read
router.get("/conflict", async (req, res) => {});
//update
router.put("/conflict", async (req, res) => {});
//delete
router.delete("/conflict", async (req, res) => {});

module.exports = router;
