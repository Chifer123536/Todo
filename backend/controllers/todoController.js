import todoModel from "../models/TodoModel.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch todos",
    });
  }
};
export const createTodo = async (req, res) => {
  try {
    const newTodo = new todoModel(req.body);
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create todo",
    });
  }
};
export const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({
      message: "Error updating todo",
    });
  }
};
export const deleteTodo = async (req, res) => {
  try {
    await todoModel.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "todoModel deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete todo",
    });
  }
};
