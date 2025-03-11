import todoModel from "../models/todoModel.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch todos",
      error: err.message,
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
      error: err.message,
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({
      message: "Error updating todo",
      error: err.message,
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await todoModel.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete todo",
      error: err.message,
    });
  }
};
