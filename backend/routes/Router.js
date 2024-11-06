import express from "express";
const router = express.Router();

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

router.get("/todos", getTodos);
router.post("/todos", createTodo);
router.put("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);

export default router;
