const { DateTime } = require("luxon");
const z = require("zod");
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

const getTodo = async (req, res) => {
  const { todoId } = req.params;

  //Todo id validation
  if (!isvalid.mongoid(todoId)) {
    return res
      .status(400)
      .json(err.validationErrorResponse("id", "todoId is not valid"));
  }

  //Finding todo with specific id and only if this todo belongs to user who have requested
  const todo = await Todo.findOne({ _id: todoId, userId: req.userId });
  if (!todo) {
    return res.status(404).json({
      code: "NOT_FOUND",
      field: "todo",
      msg: "Todo not found or user unauthorized",
    });
  }

  res.status(200).json({ success: true, todo });
};

const updateTodo = async (req, res) => {
  //fetch the todoId from params
  const { todoId } = req.params;
  if (!isvalid.mongoid(todoId)) {
    return res
      .status(400)
      .json(
        err.validationErrorResponse(
          "todoId",
          "incorrect todoId in the url params"
        )
      );
  }

  //zod schema
  const schema = z
    .object({
      title: z.string().min(1),
      description: z.string(),
      dueDate: z.coerce.date(),
      completed: z.boolean(),
    })
    .partial();

  try {
    const data = schema.parse(req.body);

    //if there is no field in the body
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json(err.validationErrorResponse("all", "No fields found to update"));
    }

    //find the todo from the databse
    const todo = await Todo.findOne({ _id: todoId, userId: req.userId });
    if (!todo) {
      res.status(404).json({
        success: false,
        err: {
          code: "NOT_FOUND",
          field: "todo",
          msg: "Todo not found with this id or User unauthorized",
        },
      });
    }

    Object.assign(todo, data);
    await todo.save();

    res.status(200).json({ success: true, msg: "todo updated successfully" });

    //catch the errors
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    } else {
      console.log(error);
      return res.status(500).json({
        success: false,
        err: {
          code: "INTERNAL_SERVER_ERROR",
          msg: "Internal Server Error",
        },
      });
    }
  }
};

const deleteTodo = async (req, res) => {
  const { todoId } = req.params;

  if (!isvalid.mongoid(todoId)) {
    return res
      .status(400)
      .json(err.validationErrorResponse("todoId", "todoId is not valid"));
  }

  const todo = await Todo.findOne({ _id: todoId, userId: req.userId });
  if (!todo) {
    return res.status(404).json({
      success: false,
      err: {
        code: "NOT_FOUND",
        field: "todo",
        msg: "todo not found with this id or User anauthorized",
      },
    });
  }

  await Todo.deleteOne({ _id: todoId });
  res.status(200).json({ success: true, msg: "successfully deleted todo" });
};

module.exports = { getAllTodos, createTodo, getTodo, updateTodo, deleteTodo };
