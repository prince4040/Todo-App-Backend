const { Router } = require("express");
const router = Router();
const {
  getAllTodos,
  createTodo,
  getTodo,
} = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAllTodos);
router.get("/:todoId", authMiddleware, getTodo);
router.post("/", authMiddleware, createTodo);

module.exports = router;
