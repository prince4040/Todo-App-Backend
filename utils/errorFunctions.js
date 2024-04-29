// Utility function for validation error response
const errors = {};

errors.validationErrorResponse = (field, msg) => {
  return {
    success: false,
    err: {
      code: "VALIDATION_ERROR",
      field,
      msg,
    },
  };
};

// Utility function for internal server error response
errors.internalServerErrorResponse = () => {
  return {
    success: false,
    err: {
      code: "INTERNAL_SERVER_ERROR",
      msg: "Internal Server Error",
    },
  };
};

module.exports = errors;
