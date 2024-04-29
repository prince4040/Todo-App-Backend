const Todo = require("../models/todo");
const User = require("../models/user");

const getAllTodos = async (req, res) => {
  const user = await User.findOne({ _id: req.userId });
  if (!user) {
    return res.status(404).json({
      success: false,
      err: {
        code: "USER_NOT_FOUND",
        msg: "user not found with given id",
      },
    });
  }

  const todos = await Todo.find({ userId: req.userId });

  res.status(200).json({
    success: true,
    useInfo: { name: user.name, email: user.email },
    todos,
  });
};

module.exports = { getAllTodos };
