const jwt = require("jsonwebtoken");
require("dotenv").config();

//verification of jwt token
const authMiddleware = (req, res, next) => {
  try {
    // const { authorization } = req.headers;
    // const token = authorization.split(" ")[1];
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("JWT token not provided");
    }

    //verify jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.userId = decoded.userId;
    next();
  } catch (e) {
    console.error("JWT verification error:", e);
    return res.status(401).json({
      success: false,
      err: {
        code: "INVALID_TOKEN",
        msg: "Invalid JWT Token",
      },
    });
  }
};

module.exports = authMiddleware;
