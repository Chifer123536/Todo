import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const todoModel = mongoose.model("Todo", todoSchema);

export default todoModel;
