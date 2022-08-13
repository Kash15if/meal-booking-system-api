const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

const sql = require("mssql");

//importing db-connection query
const pool = require("../../models/dbCon"); //importing db-pool for query

//user login
router.post("/login", async (req, res) => {
  let userCreds = req.body.user;

  try {
    let dbData = await pool
      .request()
      .input("user1", sql.Int, userCreds.user)
      .query(
        "SELECT [userid] ,[password] ,[name] ,[dept] FROM [Test_DB].[dbo].[UserDetails] where [userid] = @user1"
      );

    let foundUser = dbData.recordset[0];

    if (foundUser) {
      let submittedPass = userCreds.password;
      let storedPass = foundUser.pass;

      // const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

      if (submittedPass === storedPass) {
        let user = foundUser.user;
        let name = foundUser.name;
        var token = jwt.sign({ user }, process.env.AUTHTOKEN);

        res.status(200);
        res.send({
          auth: true,
          token: token,
          user: user,
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

//user login
router.post("/login", async (req, res) => {
  let userCreds = req.body.user;

  try {
    let dbData = await pool
      .request()
      .input("user1", sql.Int, userCreds.user)
      .query(
        "SELECT [userid] ,[password] ,[name] ,[dept] FROM [UserDetails] where [userid] = @user1"
      );

    let foundUser = dbData.recordset[0];

    if (foundUser) {
      let submittedPass = userCreds.password;
      let storedPass = foundUser.pass;

      // const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

      if (submittedPass === storedPass) {
        let user = foundUser.user;
        let name = foundUser.name;
        var token = jwt.sign({ user }, process.env.AUTHTOKEN);

        res.status(200);
        res.send({
          auth: true,
          token: token,
          user: user,
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

// ------------------- book meal api-------------------------------
//update
router.put("/meal", async (req, res) => {
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

// -------------------  Dashboard api-------------------------------
//get
router.get("/dashboard", async (req, res) => {
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

// -------------------  My all meals api-------------------------------
//get
router.get("/mymeals", async (req, res) => {
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

// -------------------  create conflicts api-------------------------------
//post
router.post("/conflicts", async (req, res) => {
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

module.exports = router;
