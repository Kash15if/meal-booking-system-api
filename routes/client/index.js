const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

const sql = require("mssql");

//importing db-connection query
const pool = require("../../models/dbCon"); //importing db-pool for query

//user login
router.post("/login", async (req, res) => {
  let userCreds = req.body;

  try {
    let dbData = await pool
      .request()
      .input("user1", sql.Int, userCreds.user)
      .query(
        "SELECT [userid] ,[password] ,[name] ,[dept] FROM [Test_DB].[dbo].[UserDetails] where [userid] = @user1"
      );

    let foundUser = dbData.recordset[0];

    console.log(foundUser);
    console.log(userCreds);

    if (foundUser) {
      let submittedPass = userCreds.password;
      let storedPass = foundUser.password;

      // const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

      if (submittedPass === storedPass) {
        let admin = foundUser.userid;
        let name = foundUser.name;
        var token = jwt.sign({ admin }, process.env.USER_KEY);

        res.status(200);
        res.send({
          auth: true,
          token: token,
          admin: admin,
          name: name,
        });
      } else {
        res.status(405);
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

// ------------------------------------------------------------------------------------------------------
//
//
//
//

// ---------------------------------------------- book meal api------------------------------------------
//update

router.get("/meal", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const payLoad = await jwt.verify(token, process.env.USER_KEY);

    console.log(payLoad);

    // const currentMonth = new Date().getMonth() + 1;

    const out = await pool
      .request()
      .input("uid", sql.Int, payLoad.admin)
      .input("Time", sql.VarChar, "Lunch")
      .query("EXEC [dbo].[getNextDayBooking] @uid , @Time");

    console.log(out.recordset);
    res.status(200);
    res.send(out.recordset);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

router.put("/meal", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.USER_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    let queryString = "";

    data.forEach((oneRow) => {
      queryString += `EXEC [dbo].[updateMealBooking] ${oneRow.UserId} ,'${oneRow.Date}', ${oneRow.Time}, ${oneRow.Menu} , ${oneRow.Meal_On} , ${oneRow.Extra_Meal};`;
    });

    const getTime = await pool.query(queryString);

    res.status = 200;
    res.send({ result: "data updated succesfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

// ------------------------------------------------------------------------------------------------------
//
//
//
//

// -------------------  Dashboard api-------------------------------
//get
router.get("/dashboard", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const payLoad = await jwt.verify(token, process.env.USER_KEY);

    console.log(payLoad);

    // const currentMonth = new Date().getMonth() + 1;

    const out = await pool
      .request()
      .input("uid", sql.Int, payLoad.admin)
      .query("EXEC [dbo].[User_Dashboard] @uid ");

    res.status(200);
    res.send(out.recordsets);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

// ------------------------------------------------------------------------------------------------------
//
//
//
//

// ------------------------------------------  My all meals api-------------------------------------------
//get
router.get("/mymeals", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const payLoad = await jwt.verify(token, process.env.USER_KEY);

    console.log(payLoad);

    // const currentMonth = new Date().getMonth() + 1;

    const out = await pool
      .request()
      .input("uid", sql.Int, payLoad.admin)
      .query(
        "SELECT * FROM [dbo].[AllMeals_Last3Month]() WHERE [UserId] = @uid;"
      );

    res.status(200);
    res.send(out.recordset);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

// ------------------------------------------------------------------------------------------------------
//
//
//
//

// -------------------  create conflicts api-------------------------------
//post
router.post("/conflicts", async (req, res) => {});

module.exports = router;
