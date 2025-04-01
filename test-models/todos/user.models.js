import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
      // required: [true, "Password is required"]
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

export const User = mongoose.model("User", userSchema);
// in mongo db it will be stored as users
// mongoose will automatically convert it to plural and lowercase