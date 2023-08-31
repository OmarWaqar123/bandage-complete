const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // Import cookie-parser
require("dotenv").config();

// Initialize cookie-parser middleware
const cookieParserMiddleware = cookieParser();

module.exports = async (req, res, next) => {
  try {
    // Use the cookie-parser middleware here to parse cookies
    cookieParserMiddleware(req, res, () => {
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ error: "User is not Logged in" });
      }

      jwt.verify(token, process.env.jwt_secret, {}, (err, info) => {
        if (err) throw err;
        req.Email = info.email;
        next();
      });
    });
  } catch (error) {
    return res.status(401).json({ error: "User is not Logged in" });
  }
};
