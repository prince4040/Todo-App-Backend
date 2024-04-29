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

module.exports = { isvalid };
