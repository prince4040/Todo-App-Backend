const { isvalid } = require("../utils/inputValidation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  //input validation
  if (!isvalid.email(email)) {
    return res.status(400).json({
      success: false,
      err: {
        code: "VALIDATION_ERROR",
        field: "email",
        msg: "email is not of valid format",
      },
    });
  }
  if (!isvalid.password(password)) {
    return res.status(400).json({
      success: false,
      err: {
        code: "VALIDATION_ERROR",
        field: "password",
        msg: "password is not of valid format",
      },
    });
  }

  //Database check - if user with this email already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      success: false,
      err: {
        code: "USER_ALREADY_EXISTS",
        field: "",
        msg: "user already exists with this email",
      },
    });
  }

  //creating user in databse
  await User.create({ name, email, password });
  res.status(201).json({ success: true, msg: "User created successfully" });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  //input validation
  if (!isvalid.email(email)) {
    return res.status(400).json({
      success: false,
      err: {
        code: "VALIDATION_ERROR",
        field: "email",
        msg: "email is not of valid format",
      },
    });
  }

  //find the user in database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      err: {
        code: "USER_NOT_FOUND",
        msg: "user not found with this email",
      },
    });
  }

  //verify the password
  const isvalidPassword = await bcrypt.compare(password, user.password);
  if (!isvalidPassword) {
    return res.status(401).json({
      success: false,
      err: {
        code: "INVALID",
        field: "password",
        msg: "password is not valid",
      },
    });
  }

  //Generate the jwt
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      iss: "prince-saliya",
      role: "user",
      //iat, exp
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.status(200).json({ success: true, token });
};

module.exports = { signup, signin };
