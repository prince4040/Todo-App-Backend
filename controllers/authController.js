const { isvalid } = require("../utils/inputValidation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = async (req, res, next) => {
  try {
    // fetching name,email,password from request body
    const { name, email, password } = req.body;

    //input validation
    isvalid.name(name); //throws error
    isvalid.email(email); //throws error
    isvalid.password(password); //throws error

    //Database check - if user with this email already exists
    const user = await User.findOne({ email }); //returns user or null
    if (user) {
      throw new Error("user already exists");
    }

    //creating user in databse
    const newUser = await User.create({ name, email, password });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });

    //catching and transmitting all the errors to global catch
  } catch (error) {
    return next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    //fetching email,password from request body
    const { email, password } = req.body;

    //input validation
    isvalid.email(email); //throws error
    isvalid.password(password); //throws error

    //find the user in database
    const user = await User.findOne({ email }); // returns user or null
    //if user not found in databse
    if (!user) {
      throw new Error("user not found");
    }

    //verify the password
    const isvalidPassword = await bcrypt.compare(password, user.password); //returns true or false
    //if password provided by user in wrong
    if (!isvalidPassword) {
      throw new Error("invalid password");
    }

    //User is authorized
    //Generate the jwt token
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

    //responding with success and token
    res
      .status(200)
      .json({ success: true, message: "token generated successfully", token });

    //catching and transmitting all the errors to global catch
  } catch (error) {
    return next(error);
  }
};

module.exports = { signup, signin };
