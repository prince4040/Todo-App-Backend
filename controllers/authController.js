const { isvalid } = require("../utils/inputValidation");
const User = require("../models/user");

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

module.exports = { signup };
