const express = require("express");
const router = express.Router();

const nodeMailer = require("nodemailer");
const excel = require("exceljs");

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
      .query("EXEC [dbo].[updateUser]  @userid , @password , @name , @dept ");

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

  console.log(jwttoken);
  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  console.log(token);
  try {
    const verified = await jwt.verify(token, process.env.ADMIN_KEY);

    console.log(verified);
    const out = await pool.query(
      "SELECT [Date] as date,Time as time, [Todays_Expense] expense,[Expense_Details] breakup,[Expense_Breakup] as details FROM [dbo].[Daily_Expense_Record] where [Date] > DATEADD(DAY , -90 , GETDATE())"
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
      .input("time", data.time)
      .input("expense", sql.Int, data.expense)
      .input("details", sql.VarChar, data.details)
      .input("breakup", sql.VarChar, data.breakup)
      .query(
        "exec [dbo].[updateExpense]  @date ,@time ,  @expense , @details , @breakup"
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
      .input("time", sql.VarChar, data.time)
      .input("expense", sql.Int, data.expense)
      .input("breakup", sql.VarChar, data.breakup)
      .input("details", sql.VarChar, data.details)
      .query(
        "UPDATE [dbo].[Daily_Expense_Record] SET [Todays_Expense] = @expense ,[Expense_Details] = @details , [Expense_Breakup] = @breakup WHERE [Date] = @date and Time = @time"
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

// ------------------- Action buttons api , to download employee data , excel download and send mails---------------------------------------------------------------------
//send mails
router.post("/sendmails", async (req, res) => {
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

    let userList = req.body;

    userList.forEach(async (oneUser) => {
      const out = await pool.query("exec Admin_Dashboard");

      let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "xxx@xx.com",
          pass: "xxxx",
        },
      });
      let mailOptions = {
        from: '"Krunal Lathiya" <xx@gmail.com>', // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.body, // plain text body
        html: "<b>NodeJS Email Tutorial</b>", // html body
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message %s sent: %s", info.messageId, info.response);
        res.render("index");
      });
    });

    res.status(200);
    res.send("Mail sent to", userList.toString());
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});
//download emp. excel
router.post("/getemp-excel", async (req, res) => {
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

    let workSheeetColumnDets = [
      [
        { header: "Id", key: "id", width: 15 },
        { header: "Date", key: "Date", width: 25 },
      ],
      [
        { header: "Id", key: "id", width: 15 },
        { header: "Amount", key: "Amount", width: 25 },
      ],
    ];

    let workbook = new excel.Workbook();
    out.forEach(async (singleSheet, index) => {
      let worksheet = workbook.addWorksheet("sheet" + (index + 1));
      console.log(singleSheet);
      worksheet.columns = workSheeetColumnDets[index];
      await worksheet.addRows(singleSheet);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tutorials.xlsx"
    );

    await workbook.xlsx.write(res);

    res.status(200).end();
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//download expense summary
router.post("/getsummary", async (req, res) => {
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

    let workSheeetColumnDets = [
      [
        { header: "Id", key: "id", width: 15 },
        { header: "Date", key: "Date", width: 25 },
      ],
      [
        { header: "Id", key: "id", width: 15 },
        { header: "Amount", key: "Amount", width: 25 },
      ],
    ];

    let workbook = new excel.Workbook();
    out.forEach(async (singleSheet, index) => {
      let worksheet = workbook.addWorksheet("sheet" + (index + 1));
      console.log(singleSheet);
      worksheet.columns = workSheeetColumnDets[index];
      await worksheet.addRows(singleSheet);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tutorials.xlsx"
    );

    await workbook.xlsx.write(res);

    res.status(200).end();
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

// ------------------------------------------------------------------------------------------------------
//
//

//-------------------------------------------------------------------------------------------------------

module.exports = router;
