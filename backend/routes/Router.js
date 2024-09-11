import express from "express";
const router = express.Router();

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

router.get("/contacts", getTodos);
router.post("contacts", createTodo);
router.put("contacts/:id", updateTodo);
router.delete("contacts/:id", deleteTodo);

export default router;
