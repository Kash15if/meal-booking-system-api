const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const sql = require("mssql");
//importing db-connection query
const pool = require("../../models/dbCon"); //importing db-pool for query

const { verifyToken, generateToken } = require("../../middleware/jwtServices");

//user login
router.post("/login", async (req, res) => {
  let userCreds = req.body;

  console.log(userCreds);
  try {
    let dbData = await pool
      .request()
      .input("user1", sql.Int, userCreds.user)
      .query(
        "SELECT [userid] ,[password] ,[name] ,[dept] FROM [dbo].[UserDetails] where [userid] = @user1"
      );

    let foundUser = dbData.recordset[0];

    if (foundUser) {
      let submittedPass = userCreds.password;
      let storedPass = foundUser.password;
      // const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (submittedPass === storedPass) {
        let user = foundUser.userid;
        let name = foundUser.name;
        var token = generateToken({ admin: user }); //jwt.sign({ admin }, process.env.USER_KEY);

        res.status(200);
        res.send({
          auth: true,
          token: token,
          admin: user,
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
//old code just for lunch, customized below code is for both lunch and evening snacks
// router.get("/meal", async (req, res) => {
//   const jwttoken = req.headers["x-access-token"];

//   if (!jwttoken)
//     return res
//       .status(401)
//       .send({ auth: false, message: "Authentication required." });

//   const TokenArray = jwttoken.split(" ");
//   const token = TokenArray[1];

//   try {
//     const payLoad = await jwt.verify(token, process.env.USER_KEY);

//     // const currentMonth = new Date().getMonth() + 1;

//     const out = await pool
//       .request()
//       .input("uid", sql.Int, payLoad.admin)
//       .input("Time", sql.VarChar, "Lunch")
//       .query("EXEC [dbo].[getNextDayBooking] @uid , @Time");

//     res.status(200);
//     res.send(out.recordset);
//   } catch (err) {
//     console.log(err);
//     return res
//       .status(500)
//       .send({ auth: false, message: "Failed to authenticate token." });
//   }
// });

// router.put("/meal", async (req, res) => {
//   const jwttoken = req.headers["x-access-token"];

//   if (!jwttoken)
//     return res
//       .status(401)
//       .send({ auth: false, message: "Authentication required." });

//   const TokenArray = jwttoken.split(" ");
//   const token = TokenArray[1];

//   try {
//     const verified = await jwt.verify(token, process.env.USER_KEY);

//     const users = jwt.decode(token);

//     const data = req.body;

//     let queryString = "";

//     data.forEach((oneRow) => {
//       let formatDate = new Date(oneRow.Date);
//       queryString += `EXEC [dbo].[updateMealBooking] ${oneRow.UserId} ,'${
//         formatDate.toISOString().split("T")[0]
//       }', '${oneRow.Time}', '${oneRow.Menu} ', ${oneRow.Meal_On} , ${
//         oneRow.Extra_Meal
//       };`;
//     });

//     const getTime = await pool.query(queryString);

//     res.status = 200;
//     res.send({ result: "data updated succesfully" });
//   } catch (err) {
//     return res
//       .status(500)
//       .send({ auth: false, message: "Failed to authenticate token." });
//   }
// });

// ------------------------------------------------------------------------------------------------------
//
//
//

// ---------------------------------------------- snacks meal api------------------------------------------
//update

router.get("/meals", verifyToken, async (req, res) => {
  try {
    // const currentMonth = new Date().getMonth() + 1;
    const out = await pool
      .request()
      .input("uid", sql.Int, payLoad.admin)
      .input("Time", sql.VarChar, time)
      .query("EXEC [dbo].[getNextDayBooking] @uid , @Time");

    res.status(200);
    res.send(out.recordset);
  } catch (err) {
    console.log(err);
    return res.status(401).send({ auth: false, message: err });
  }
});

router.put("/meals", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    let queryString = "";
    data.forEach((oneRow) => {
      let formatDate = new Date(oneRow.Date);
      queryString += `EXEC [dbo].[updateMealBooking] ${oneRow.UserId} ,'${
        formatDate.toISOString().split("T")[0]
      }', '${time}', '${oneRow.Menu} ', ${oneRow.Meal_On} , ${
        oneRow.Extra_Meal
      } , 0 , ${oneRow.roti};`;
    });

    const getTime = await pool.query(queryString);

    res.status = 200;
    res.send({ result: "data updated succesfully" });
  } catch (err) {
    return res.status(401).send({ auth: false, message: err });
  }
});

// ------------------------------------------------------------------------------------------------------
//
//
//
//
//

// -------------------  Dashboard api-------------------------------
//get
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
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
router.get("/mymeals", verifyToken, async (req, res) => {
  try {
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
router.post("/conflicts", verifyToken, async (req, res) => {});

module.exports = router;
