const { Router } = require("express");
const router = Router();
const {
  getAllTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAllTodos);
router.get("/:todoId", authMiddleware, getTodo);
router.post("/", authMiddleware, createTodo);
router.put("/:todoId", authMiddleware, updateTodo);
router.delete("/:todoId", authMiddleware, deleteTodo);

module.exports = router;
