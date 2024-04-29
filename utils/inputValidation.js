const { DateTime } = require("luxon");
const z = require("zod");
const isvalid = {};

isvalid.email = function (val) {
  const emailSchema = z.string().email();
  const response = emailSchema.safeParse(val);

  if (response.success) {
    return true;
  }
  return false;
};

isvalid.password = function (val) {
  const passSchema = z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

  const response = passSchema.safeParse(val);

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

isvalid.date = function (val) {
  const dateSchema = z.string(z.date());

  const response = dateSchema.safeParse(val);
  if (response.success) {
    return true;
  }
  return false;
};

isvalid.dueDate = function (val) {
  const dateSchema = z.string(z.date());
  const response = dateSchema.safeParse(val);

  if (!response) {
    return false;
  }

  const currDate = DateTime.now();
  const date = DateTime.fromISO(val);
  if (date > currDate) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isvalid };
