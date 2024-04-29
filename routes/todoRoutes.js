const { Router } = require("express");
const router = Router();
const { getAllTodos } = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAllTodos);

module.exports = router;
