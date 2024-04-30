const { DateTime } = require("luxon");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const z = require("zod");
const isvalid = {};

isvalid.email = function (val) {
  const emailSchema = z.string().email();

  try {
    const response = emailSchema.parse(val);
    return response;
  } catch (error) {
    error.field = "email";
    throw error;
  }
};

isvalid.password = function (val) {
  const passSchema = z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

  try {
    const response = passSchema.parse(val);
    return response;
  } catch (error) {
    error.field = "password";
    throw error;
  }
};

isvalid.name = function (val) {
  const nameSchema = z.string().min(2);

  try {
    const response = nameSchema.parse(val);
    return response;
  } catch (error) {
    error.field = "name";
    throw error;
  }
};

isvalid.title = function (val) {
  const schema = z.string().min(1);

  try {
    const response = schema.parse(val);
    return response;
  } catch (error) {
    error.field = "title";
    throw error;
  }
};

isvalid.description = function (val) {
  const schema = z.string();

  try {
    const response = schema.parse(val);
    return response;
  } catch (error) {
    error.field = "description";
    throw error;
  }
};

isvalid.dueDate = function (val) {
  const dateSchema = z.coerce.date();

  try {
    const response = dateSchema.parse(val);

    const currDate = new Date();
    const date = response;

    if (date.getTime() <= currDate.getTime()) {
      throw new Error("date passed");
    }
    return response;
  } catch (error) {
    error.field = "dueDate";
    throw error;
  }
};

isvalid.date = function (val) {
  const dateSchema = z.coerce.date();

  const response = dateSchema.safeParse(val);
  if (response.success) {
    return true;
  }
  return false;
};

isvalid.string = function (val, minLength = 0) {
  const schema = z.string().min(minLength);
  if (schema.safeParse(val).success) {
    return true;
  }
  return false;
};

isvalid.mongoid = function (val) {
  const res = mongoose.Types.ObjectId.isValid(val);
  if (res) {
    return true;
  }
  throw new Error("invalid todoId");
};

isvalid.updateTodoValidation = function (obj) {
  const schema = z
    .object({
      title: z.string().min(1),
      description: z.string(),
      dueDate: z.coerce.date(),
      completed: z.boolean(),
    })
    .partial();

  try {
    const response = schema.parse(obj);

    if (response.dueDate) {
      const currDate = new Date();
      const date = response.dueDate;

      if (date.getTime() <= currDate.getTime()) {
        throw new Error("date passed");
      }
    }

    return response;
  } catch (error) {
    error.field = "dueDate";
    throw error;
  }
};

isvalid.boolean = function (val) {
  const booleanSchema = z.boolean();
  if (booleanSchema.safeParse(val).success) {
    return true;
  }
  return false;
};

module.exports = { isvalid };
