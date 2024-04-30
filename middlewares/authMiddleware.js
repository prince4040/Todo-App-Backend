const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

//verification of jwt token
const authMiddleware = async (req, res, next) => {
  try {
    //fetching authorization header if present
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("token not provided");
    }

    //verify jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //throws error
    //setting userId and email to request object
    req.userId = decoded.userId;
    req.email = decoded.email;

    //verifing that user exists in database
    const user = await User.findOne({ _id: decoded.userId }); //returns user or null
    if (!user) {
      throw new Error("user not found");
    }

    //calling next middleware if token verified
    next();

    //catching and transmitting all the errors to global catch
  } catch (error) {
    return next(error);
  }
};

module.exports = authMiddleware;
