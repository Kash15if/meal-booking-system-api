var jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const jwttoken = req.headers["x-access-token"];

  if (!jwttoken)
    return res
      .status(401)
      .send({ auth: false, message: "Authentication required." });

  const TokenArray = jwttoken.split(" ");
  const token = TokenArray[1];

  try {
    const decoded = await jwt.verify(token, process.env.ADMIN_KEY);
    req.payLoad = decoded;
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }

  next();
};

const generateToken = (payload) => {
  var token = jwt.sign({ ...payload }, process.env.ADMIN_KEY);
  return token;
};

module.exports = { verifyToken, generateToken };
