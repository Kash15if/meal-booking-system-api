const express = require("express");
const router = express.Router();
const nodeMailer = require("nodemailer");
const excel = require("exceljs");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const sql = require("mssql");
//importing db-connection query
const pool = require("../../models/dbCon"); //importing db-pool for query

const { verifyToken, generateToken } = require("../../middleware/jwtServices");

router.get("/test", async (req, res) => {
  console.log(verifyToken("dfvfd"), generateToken("sdd"));
  // const out = await pool.query(
  //   "SELECT [Date] ,[Time] ,[Menu] FROM [Menu];SELECT [Date] ,[Time] ,[Menu] FROM [Menu]"
  // );

  // //recordset for single dataset , recordset for multiple dataset
  // res.send(out.recordsets);
  res.send("tested");
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

    if (foundUser) {
      let submittedPass = userCreds.password;
      let storedPass = foundUser.password;

      // const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

      if (submittedPass === storedPass) {
        let admin = foundUser.admin;
        let name = foundUser.name;
        var token = generateToken({ admin: admin }); //jwt.sign({ admin }, process.env.ADMIN_KEY);

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
router.get("/menu", verifyToken, async (req, res) => {
  try {
    // const currentMonth = new Date().getMonth() + 1;
    const out = await pool.query(
      "SELECT [Date] ,[Time] ,[Menu] FROM [dbo].[Menu] where [Date] > DATEADD(DAY , -90 , GETDATE())"
    );

    res.status(200);
    res.send(out.recordset);
  } catch (err) {
    return res.status(401).send({ auth: false, message: err });
  }
});

//add
router.post("/menu", verifyToken, async (req, res) => {
  try {
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
    return res.status(401).send({ auth: false, message: err });
  }
});
//update
router.put("/menu", verifyToken, async (req, res) => {
  try {
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
router.delete("/menu", verifyToken, async (req, res) => {
  try {
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
router.get("/user", verifyToken, async (req, res) => {
  const jwttoken = req.headers["x-access-token"];

  try {
    const out = await pool.query(
      "SELECT [userid] ,[password] ,[name] ,[dept] FROM [dbo].[UserDetails]"
    );

    res.status(200);
    res.send(out.recordset);
  } catch (err) {
    return res.status(401).send({ auth: false, message: err });
  }
});
//add
router.post("/user", verifyToken, async (req, res) => {
  try {
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
router.put("/user", verifyToken, async (req, res) => {
  try {
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
router.delete("/user", verifyToken, async (req, res) => {
  try {
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
router.get("/expense", verifyToken, async (req, res) => {
  try {
    const out = await pool.query(
      "SELECT [Date] as date,Time as time, [Todays_Expense] expense,[Expense_Details] breakup,[Expense_Breakup] as details FROM [dbo].[Daily_Expense_Record] where MONTH([Date]) = MONTH( GETDATE()) order by [Date]  desc"
    );

    res.status(200);
    res.send(out.recordset);
  } catch (err) {
    return res.status(401).send({ auth: false, message: err });
  }
});

//add
router.post("/expense", verifyToken, async (req, res) => {
  try {
    const data = req.body;
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
    return res.status(401).send({ auth: false, message: err });
  }
});

//update
router.put("/expense", verifyToken, async (req, res) => {
  try {
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
router.delete("/expense", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const getTime = await pool
      .request()
      .input("date", sql.VarChar, data.date)
      .input("time", sql.VarChar, data.time)
      .query(
        "DELETE FROM [dbo].[Daily_Expense_Record] WHERE [Date] = @date and [Time] = @time"
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

// ------------------------------------------Dashboard Api---------------------------------------------------

//get only
//query->
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
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
router.get("/allmeals", verifyToken, async (req, res) => {
  try {
    const out = await pool.query(
      "SELECT * FROM [dbo].[AllMeals_Last3Month] () order by [Date] desc , [UserId]"
    );

    res.status(200);
    res.send(out.recordset);
  } catch (err) {
    return res.status(401).send({ auth: false, message: err });
  }
});

// ------------------------------------------------------------------------------------------------------
//
//
//
//

// ------------------- resolve conflict api---------------------------------------------------------------------
//read
router.get("/conflict", verifyToken, async (req, res) => {});
//update
router.put("/conflict", verifyToken, async (req, res) => {});
//delete
router.delete("/conflict", verifyToken, async (req, res) => {});

// ------------------------------------------------------------------------------------------------------
//
//
//

// ------------------- Action buttons api , to download employee data , excel download and send mails---------------------------------------------------------------------
//send mails
router.post("/sendmails", verifyToken, async (req, res) => {
  try {
    let userList = req.body;
    let month = new Date().getMonth();
    month += 1;

    userList.forEach(async (records) => {
      const out = await pool.query(
        "exec [SendBills]" + records.id + "," + month
      );

      let transporter = nodeMailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_E_PASS,
        },
      });

      let dataTobeMailed = out.recordset[0];

      let mailOptions = {
        from: '"Meal Admin" <' + process.env.ADMIN_EMAIL + ">", // sender address
        to: dataTobeMailed.user_email, // list of receivers
        subject: process.env.BILL_EMAIL_SUBJECT, // Subject line
        text: JSON.stringify(dataTobeMailed), // plain text body
        html: ` <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
              }
        
              td,
              th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
              }
        
              tr:nth-child(even) {
                background-color: #dddddd;
              }
            </style>
          </head>
          <body>
            <div>
              <h3 style="text-align: center">Dear ${
                dataTobeMailed.user_name
              } , Your This month's Meal Bill</h3>
              <table>
                <tr>
                  <td>No. Of Lunch</td>
                  <td>${dataTobeMailed.Lunch}</td>
                </tr>
                <tr>
                  <td>Per Meal Cost</td>
                  <td>${dataTobeMailed.LunchCost}</td>
                </tr>
                <tr>
                  <td>Total Lunch Cost</td>
                  <td>${dataTobeMailed.LunchAmount}</td>
                </tr>
                <tr>
                  <td>Subsidised Meal Cost(@50%)</td>
                  <td>${dataTobeMailed.LunchAmount / 2}</td>
                </tr>
                <tr>
                  <td>No. Of Snacks</td>
                  <td>${dataTobeMailed.Snacks}</td>
                </tr>
                <tr>
                  <td>Per Snacks Cost</td>
                  <td>${dataTobeMailed.SnacksCost}</td>
                </tr>
                <tr>
                  <td>Total Snacks Cost</td>
                  <td>${dataTobeMailed.SnacksAmount}</td>
                </tr>
                <tr>
                  <td>Subsidised Snacks Cost(@50%)</td>
                  <td>${dataTobeMailed.SnacksAmount / 2}</td>
                </tr>
                <tr>
                  <td>Total Cost (without subsidy)</td>
                  <td>${dataTobeMailed.Amount}</td>
                </tr>
                <tr style="color: white; background-color: green;">
                  <td>Amount to be paid(with subsidy)</td>
                  <td >${dataTobeMailed.ToBePaid}</td>
                </tr>
              </table>
            </div>
        
            <div>
              <h4 style="text-align: center">
                Please pay 
                <span
                  style="
                    color: white;
                    background-color: green;
                    font-size: 30;
                    padding: 2px;
                    margin: 0 3px;
                  "
                  > ${dataTobeMailed.ToBePaid} </span>
              </h4>
              <div style="display: flex; justify-content: center; align-items: center">
               <h2> There will be no UPI payment this time , Employees will have to pay in cash.</h2>
              </div>
            </div>
          </body>
        </html>
        `, // html body
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log("err", error);
        }
        console.log("Message %s sent: %s", info.messageId, info.response);

        res.render("index");
      });
    });

    res.status(200).send("Mail sent to: " + userList.toString());
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});
//download emp. excel
router.post("/getemp-excel", verifyToken, async (req, res) => {
  try {
    const { uid, name, month } = req.body;
    const out = await pool.query(
      "exec DownloadEmployeeData " + uid + " , " + month + " ;"
    );

    // console.log(out.recordsets);
    let workSheeetColumnDets = [
      [
        { header: "Date", key: "Date", width: 20 },
        { header: "Lunch", key: "Lunch", width: 20 },
        { header: "Snacks", key: "Snacks", width: 20 },
        { header: "SnacksCost", key: "SnacksCost", width: 25 },
        { header: "Total", key: "Total", width: 20 },
      ],
    ];

    let workbook = new excel.Workbook();
    out.recordsets.forEach(async (singleSheet, index) => {
      let worksheet = workbook.addWorksheet("sheet" + (index + 1));
      // console.log(singleSheet);
      worksheet.columns = workSheeetColumnDets[index];
      await worksheet.addRows(singleSheet);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Meals.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//download expense summary
router.post("/getsummary", verifyToken, async (req, res) => {
  try {
    const month = req.body.month;
    const year = req.body.year;

    const out = await pool.query(
      "exec Download_Expense_Summary " + month + " , " + year
    );

    let workSheeetColumnDets = [
      [
        { header: "All_Expense", key: "All_Expense", width: 25 },
        { header: "Lunch_Expense", key: "Lunch_Expense", width: 25 },
        { header: "Snacks_Expense", key: "Snacks_Expense", width: 25 },
        { header: "Total_Meal", key: "Total_Meal", width: 25 },
        { header: "Roti", key: "roti", width: 25 },
        { header: "Lunch_Cost", key: "Lunch_Cost", width: 25 },
        { header: "ES_Cost", key: "ES_Cost", width: 25 },
        { header: "Total_Snacks", key: "Total_Snacks", width: 25 },
        {
          header: "Last_Month_LunchCharge",
          key: "Last_Month_LunchCharge",
          width: 25,
        },
        {
          header: "Last_Month_ESCharge",
          key: "Last_Month_ESCharge",
          width: 25,
        },
        { header: "Id", key: "id", width: 25 },
      ],
      [
        { header: "Date", key: "Date", width: 15 },
        { header: "Lunch", key: "Lunch", width: 25 },
        { header: "ES", key: "ES", width: 15 },
        { header: "Roti", key: "roti", width: 15 },
      ],
      [
        { header: "UserID", key: "userid", width: 15 },
        { header: "Name", key: "name", width: 25 },
        { header: "Department", key: "dept", width: 25 },
        { header: "Snacks", key: "Snacks", width: 15 },
        { header: "Lunch", key: "Lunch", width: 15 },
        { header: "Roti", key: "roti", width: 15 },
        { header: "LunchCost", key: "LunchCost", width: 15 },
        { header: "SnacksCost", key: "SnacksCost", width: 15 },
        { header: "SnacksAmount", key: "SnacksAmount", width: 15 },
        { header: "LunchAmount", key: "LunchAmount", width: 15 },
        { header: "Amount", key: "Amount", width: 15 },
        { header: "Subsidy", key: "Subsidy", width: 15 },
        { header: "ToBePaid", key: "ToBePaid", width: 15 },
      ],
    ];

    let workbook = new excel.Workbook();
    out.recordsets.forEach(async (singleSheet, index) => {
      let worksheet = workbook.addWorksheet(
        index === 0
          ? "Monthly_Summary"
          : index === 1
          ? "Daywise_Meals"
          : "UsersBill"
      );
      // if(index === 0)
      //   console.log(singleSheet);

      worksheet.columns = workSheeetColumnDets[index];
      await worksheet.addRows(singleSheet);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Meals.xlsx"
    );

    await workbook.xlsx.write(res);

    res.status(200).end();
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

//--------------------------------------------------------------------------------------------------------
// ------------------- manage user api-------------------------------
//read
router.get("/post-booking", verifyToken, async (req, res) => {
  try {
    const out = await pool.query(
      "SELECT * FROM  [MealDB].[dbo].[BookedMeal] where postbook = 1 and MONTH(Date) = MONTH(getDate()) and Date <=   CONVERT(Date , getDate())"
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
router.post("/post-booking", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const getTime = await pool
      .request()
      .input("userid", sql.Int, parseInt(data.id))
      .input("date", sql.Date, data.date)
      .input("time", sql.VarChar, data.time)
      .input("menu", sql.VarChar, "No menu added")
      .input("mealOn", sql.Int, 1)
      .input("additional", sql.Int, 0)
      .input("postbook", sql.Int, 1)
      .query(
        "EXEC [dbo].[updateMealBooking_post]  @userid , @date , @time , @menu , @mealOn , @additional,@postbook  "
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
router.put("/post-booking", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const getTime = await pool
      .request()
      .input("userid", sql.Int, parseInt(data.id))
      .input("date", sql.Date, data.date)
      .input("time", sql.VarChar, data.time)
      .input("menu", sql.VarChar, "No menu added")
      .input("mealOn", sql.Int, 1)
      .input("additional", sql.Int, 0)
      .input("postbook", sql.Int, 1)
      .query(
        "EXEC [dbo].[updateMealBooking_post]  @userid , @date , @time , @menu , @mealOn , @additional, @postbook "
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
router.delete("/post-booking", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const getTime = await pool
      .request()
      .input("uid", sql.Int, parseInt(data.id))
      .input("date", sql.Date, data.date)
      .input("time", sql.VarChar, data.time)
      .query(
        "delete FROM [MealDB].[dbo].[BookedMeal] where [UserId] = @uid and [Date] = @date and [Time] = @time and postbook = 1"
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

//-------------------------------------------------------------------------------------------------------
// -------------get all users---------------------------
//

router.get("/getusers", verifyToken, async (req, res) => {
  try {
    // const currentMonth = new Date().getMonth() + 1;
    const out = await pool.query(
      "SELECT  [userid] as [id] FROM [dbo].[UserDetails] order by userid"
    );

    res.status(200);
    res.send(out.recordset);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//-------------------------------------------------------------------------------------------------------
module.exports = router;
