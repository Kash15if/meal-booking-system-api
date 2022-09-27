const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const payLoad = await jwt.verify(token, process.env.USER_KEY);
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};
