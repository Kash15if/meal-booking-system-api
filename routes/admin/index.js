const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

const sql = require("mssql");

//importing db-connection query
const pool = require("../../models/dbCon"); //importing db-pool for query

router.get("/test", async (req, res) => {
  const out = await pool.query(
    "SELECT [Date] ,[Time] ,[Menu] FROM [Menu];SELECT [Date] ,[Time] ,[Menu] FROM [Menu]"
  );

  //recordset for single dataset , recordset for multiple dataset
  res.send(out.recordsets);
});

// ------------------------------------------------------------------------------------------------------
//
//
//
//

//----------------------------------------------admin login----------------------------------------------
router.post("/login", async (req, res) => {
  let userCreds = req.body;

  try {
    let dbData = await pool
      .request()
      .input("user1", sql.Int, userCreds.user)
      .query(
        "SELECT [admin] ,[password] ,[name] FROM [admins] where [admin] = @user1"
      );

    let foundUser = dbData.recordset[0];

    console.log(foundUser);
    if (foundUser) {
      let submittedPass = userCreds.password;
      let storedPass = foundUser.password;

      // const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

      if (submittedPass === storedPass) {
        let admin = foundUser.admin;
        let name = foundUser.name;
        var token = jwt.sign({ admin }, process.env.ADMIN_KEY);

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

// ------------------------------------------------------------------------------------------------------
//
//
//
//

// ----------------------------------------------- manage menu api------------------------------------------
//read
router.get("/menu", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    // const currentMonth = new Date().getMonth() + 1;

    const out = await pool.query(
      "SELECT [Date] ,[Time] ,[Menu] FROM [Test_DB].[dbo].[Menu] where [Date] > DATEADD(DAY , -90 , GETDATE())"
    );

    res.status(200);
    res.send(out.recordset);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//add
router.post("/menu", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    const getTime = await pool
      .request()
      .input("date", sql.Date, data.date)
      .input("Time", sql.VarChar, data.time)
      .input("menu", sql.VarChar, data.menu)
      .query("exec [dbo].[updateMenu]  @date, @Time , @menu");

    res.status = 200;
    res.send({ result: "data updated succesfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});
//update
router.put("/menu", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    const getTime = await pool
      .request()
      .input("date", sql.Date, data.date)
      .input("time", sql.VarChar, data.time)
      .input("menu", sql.VarChar, data.menu)
      .query(
        "UPDATE [dbo].[Menu] SET [Menu] = @menu WHERE [Date] = @date AND [Time] = @time"
      );

    res.status = 200;
    res.send({ result: "data updated succesfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});
//delete
router.delete("/menu", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    const getTime = await pool
      .request()
      .input("date", sql.Date, data.date)
      .input("time", sql.VarChar, data.time)
      .query(
        "DELETE FROM [dbo].[Menu] WHERE [Date] = @date AND [Time] = @time"
      );

    res.status = 200;
    res.send({ result: "data Deleted succesfully" });
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

//--------------------------------------------------------------------------------------------------------
// ------------------- manage user api-------------------------------
//read
router.get("/user", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const out = await pool.query(
      "SELECT [userid] ,[password] ,[name] ,[dept] FROM [Test_DB].[dbo].[UserDetails]"
    );

    res.status(200);
    res.send(out.recordset);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});
//add
router.post("/user", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    const getTime = await pool
      .request()
      .input("userid", sql.Int, data.userid)
      .input("password", sql.VarChar, data.password)
      .input("name", sql.VarChar, data.name)
      .input("dept", sql.VarChar, data.dept)
      .query(
        "INSERT INTO [dbo].[UserDetails] VALUES (@userid , @password , @name , @dept)"
      );

    res.status = 200;
    res.send({ result: "data updated succesfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});
//update
router.put("/user", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    const getTime = await pool
      .request()
      .input("uid", sql.Int, data.userid)
      .input("password", sql.VarChar, data.password)
      .input("name", sql.VarChar, data.name)
      .input("dept", sql.VarChar, data.dept)
      .query(
        "UPDATE [dbo].[UserDetails] SET [password] = @password , [name] = @name , [dept] = @dept WHERE [userid] = @uid"
      );

    res.status = 200;
    res.send({ result: "data updated succesfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});
//delete
router.delete("/user", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    const getTime = await pool
      .request()
      .input("uid", sql.Int, data.userid)
      .query("DELETE FROM [dbo].[UserDetails]  WHERE [userid] = @uid");

    res.status = 200;
    res.send({ result: "data Deleted succesfully" });
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

// ---------------------------------------- Daily Expense Record api-----------------------------------------
//read
router.get("/expense", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const out = await pool.query(
      "SELECT [Date] as date,[Todays_Expense] expense,[Expense_Details] breakup,[Expense_Breakup] as details FROM [dbo].[Daily_Expense_Record] where [Date] > DATEADD(DAY , -90 , GETDATE())"
    );

    res.status(200);
    res.send(out.recordset);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//add
router.post("/expense", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;
    console.log(data);

    const getTime = await pool
      .request()
      .input("date", sql.Date, data.date)
      .input("expense", sql.Int, data.expense)
      .input("breakup", sql.VarChar, data.breakup)
      .input("details", sql.VarChar, data.details)
      .query(
        "INSERT INTO [dbo].[Daily_Expense_Record] VALUES (@date , @expense , @details , @breakup)"
      );

    res.status = 200;
    res.send({ result: "data updated succesfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//update
router.put("/expense", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    const getTime = await pool
      .request()
      .input("date", sql.VarChar, data.date)
      .input("expense", sql.Int, data.expense)
      .input("breakup", sql.VarChar, data.breakup)
      .input("details", sql.VarChar, data.details)
      .query(
        "UPDATE [dbo].[Daily_Expense_Record] SET [Todays_Expense] = @expense ,[Expense_Details] = @details , [Expense_Breakup] = @breakup WHERE [Date] = @date"
      );

    res.status = 200;
    res.send({ result: "data updated succesfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//delete
router.delete("/expense", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const data = req.body;

    const getTime = await pool
      .request()
      .input("date", sql.VarChar, data.date)
      .query("DELETE FROM [dbo].[Daily_Expense_Record] WHERE [Date] = @date");

    res.status = 200;
    res.send({ result: "data Deleted succesfully" });
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

// ------------------------------------------Dashboard Api---------------------------------------------------

//get only
//query->
router.get("/dashboard", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const out = await pool.query("exec Admin_Dashboard");

    res.status(200);
    res.send(out.recordsets);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//
// ------------------------------------------------------------------------------------------------------
//
//
//
//

// ---------------------------------------------All Meals Api------------------------------------------
//get only
router.get("/allmeals", async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    const users = jwt.decode(token);

    const out = await pool.query(
      "SELECT * FROM [dbo].[AllMeals_Last3Month] () order by [Date] desc , [UserId]"
    );

    res.status(200);
    res.send(out.recordset);
  } catch {
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

// ------------------- resolve conflict api---------------------------------------------------------------------
//read
router.get("/conflict", async (req, res) => {});
//update
router.put("/conflict", async (req, res) => {});
//delete
router.delete("/conflict", async (req, res) => {});

// ------------------------------------------------------------------------------------------------------
//
//
//
//-------------------------------------------------------------------------------------------------------

module.exports = router;
