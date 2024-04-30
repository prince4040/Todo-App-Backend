const z = require("zod");

const errMiddleware = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    res.status(400).json({ error: "Invalid JSON payload" });
  }

  //
  else if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        errors: error.errors.map((e) => ({
          field: e.path.join(".").length ? e.path.join(".") : error.field,
          message: e.message,
        })),
      },
    });
  }

  // 409 USER_ALREADY_EXISTS
  else if (error.message === "user already exists") {
    return res.status(409).json({
      success: false,
      err: {
        code: "USER_ALREADY_EXISTS",
        message: "user already exists with this email",
      },
    });
  }

  //404 USER_NOT_FOUND
  else if (error.message === "user not found") {
    return res.status(404).json({
      success: false,
      err: {
        code: "USER_NOT_FOUND",
        message: "user not found with this email",
      },
    });
  }

  //401 INVALID_PASSWORD
  else if (error.message === "invalid password") {
    return res.status(401).json({
      success: false,
      err: {
        code: "INVALID_PASSWORD",
        field: "password",
        message: "password is not valid",
      },
    });
  }

  //internal server error
  else {
    console.log(error);
    return res.status(500).json({
      success: false,
      err: {
        code: "INTERNAL_SERVER_ERROR",
        msg: "Internal Server Error",
      },
    });
  }
};

module.exports = errMiddleware;
