const { Router } = require("express");
const router = Router();
const { getAllTodos, createTodo } = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAllTodos);
router.post("/", authMiddleware, createTodo);

module.exports = router;
