const { DateTime } = require("luxon");
const Todo = require("../models/todo");
const User = require("../models/user");
const { isvalid } = require("../utils/inputValidation");
const err = require("../utils/errorFunctions");

const getAllTodos = async (req, res) => {
  const user = await User.findOne({ _id: req.userId });
  const todos = await Todo.find({ userId: req.userId }).sort({ dueDate: -1 });

  res.status(200).json({
    success: true,
    useInfo: { name: user.name, email: user.email },
    todos,
  });
};

const createTodo = async (req, res) => {
  const { title, description, dueDate } = req.body;
  //Input validation
  if (!isvalid.string(title, 1)) {
    return res
      .status(400)
      .json(err.validationErrorResponse("title", "title is not valid"));
  }
  if (!isvalid.string(description)) {
    return res
      .status(400)
      .json(
        err.validationErrorResponse("description", "description is not valid")
      );
  }
  if (!isvalid.dueDate(dueDate)) {
    return res
      .status(400)
      .json(
        err.validationErrorResponse("dueDate", "dueDate is not of valid format")
      );
  }

  try {
    const todo = await Todo.create({
      title,
      description,
      dueDate,
      userId: req.userId,
    });

    res.status(201).json({
      success: true,
      todoId: todo._id.toString(),
      msg: "todo created",
    });

    //Catch the error when dueDate parsing is fail in mongoose
  } catch (error) {
    if (error.errors && error.errors.dueDate) {
      return res
        .status(400)
        .json(
          err.validationErrorResponse(
            "dueDate",
            "dueDate is not of valid format"
          )
        );
    } else {
      return res.status(500).json(err.internalServerErrorResponse());
    }
  }
};

module.exports = { getAllTodos, createTodo };
