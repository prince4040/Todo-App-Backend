const errMiddleware = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    res.status(400).json({ error: "Invalid JSON payload" });
  } else {
    next();
  }
};

module.exports = errMiddleware;
