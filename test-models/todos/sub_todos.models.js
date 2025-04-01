import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    complete: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, // reference to the user who created this subtodo item through the user model
  }, {
  timestamps: true // createdAt, updatedAt
}
);

export const subTodo = mongoose.model("SubTodo", subTodoSchema);