import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String, 
      required: true,
    },
    complete: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, // reference to the user who created this todo item through the user model 
    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubTodo"
      }
    ] // Array of SubTodo references
  }, 
  {
  timestamps: true // createdAt, updatedAt
  }
);

export const Todo = mongoose.model("Todo", todoSchema);