const { DateTime } = require("luxon");
const z = require("zod");
const Todo = require("../models/todo");
const User = require("../models/user");
const { isvalid } = require("../utils/inputValidation");
const err = require("../utils/errorFunctions");

const getAllTodos = async (req, res) => {
  try {
    //finding the user from databse
    const user = await User.findOne({ _id: req.userId });

    //finding all the todos of user and sort them in ascending order of dueDate
    const todos = await Todo.find({ userId: req.userId }).sort({ dueDate: 1 });

    //responding with userInfo and all the todos
    res.status(200).json({
      success: true,
      userInfo: { name: user.name, email: user.email },
      todos,
    });

    //catching and transmitting all the errors to global catch
  } catch (error) {
    return next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    //fetching title,description,dueDate from request body
    const { title, description, dueDate } = req.body;

    //input validation
    isvalid.title(title); //throws error
    isvalid.description(description); //throws error
    isvalid.dueDate(dueDate); //throws error

    //creating todo in the database
    const todo = await Todo.create({
      title,
      description,
      dueDate,
      userId: req.userId,
    });

    //responding success message with newly created todoId
    res.status(201).json({
      success: true,
      message: "todo created",
      data: { todoId: todo._id.toString() },
    });

    //catching and transmitting all the errors to global catch
  } catch (error) {
    return next(error);
  }
};

const getTodo = async (req, res, next) => {
  try {
    // fetch todoId from url params
    const { todoId } = req.params;

    //todoId validation
    isvalid.mongoid(todoId); // throws error

    //Finding todo with specific id and only if this todo belongs to user who have requested
    const todo = await Todo.findOne({ _id: todoId, userId: req.userId }); //returns todo or null
    if (!todo) {
      throw new Error("todo not found");
    }

    //responde with fetched todo from databse
    res.status(200).json({ success: true, todo });

    //catching and transmitting all the errors to global catch
  } catch (error) {
    return next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    //fetch the todoId from params
    const { todoId } = req.params;

    //input validation
    isvalid.mongoid(todoId); //throws error

    //request body validation
    //This 'isvalid.updateTodoValidation' function checks all the fields of request body like 'title','description', 'dueDate', 'completed' and returns a object with available fields if verification succeeds. If any extra fields are coming with req.body then that fields will not be included in returned object
    const data = isvalid.updateTodoValidation(req.body); //throws error, can give empty object

    //checking that received obj is not empty
    if (Object.keys(data).length === 0) {
      throw new Error("no fields in body");
    }

    //finding the todo from the database
    const todo = await Todo.findOne({ _id: todoId, userId: req.userId });
    if (!todo) {
      throw new Error("todo not found");
    }

    //updating the todo
    Object.assign(todo, data);
    //saving the todo to database
    await todo.save();

    //responding with success messsage
    res.status(200).json({ success: true, msg: "todo updated successfully" });

    //catching and transmitting all the errors to global catch
  } catch (error) {
    return next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    //fetching todoId from url params
    const { todoId } = req.params;

    // input validation
    isvalid.mongoid(todoId); //trows error

    //finding the todo from database
    const todo = await Todo.findOne({ _id: todoId, userId: req.userId });
    if (!todo) {
      throw new Error("todo not found");
    }

    //deleting the todo
    await Todo.deleteOne({ _id: todoId });
    //responding with success message
    res
      .status(200)
      .json({ success: true, msg: "successfully deleted the todo" });

    //catching and transmitting all the errors to global catch
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAllTodos, createTodo, getTodo, updateTodo, deleteTodo };
