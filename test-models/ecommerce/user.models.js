import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, 
      required: true,
      unique: true,
      lowercase: true, 
    },
    email: {
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String, 
      required: true
    }
    // isActive: {
    //   type: Boolean,
    //   default: true
    // }, 
    // role: {
    //   type: String,
    //   enum: ["ADMIN", "USER"],
    //   default: "USER"
    // }, 
    // phoneNumber: {
    //   type: Number,
    //   required: true,
    //   unique: true
    // },
    // countryCode: {
    //   type: String,
    //   required: true
    // },
    // firstName: {
    //   type: String,
    //   required: true
    // }, 
    // middleName: {
    //   type: String
    // },
    // lastName: {
    //   type: String,
    //   required: true
    // }
  },
  {
    timestamps: true // createdAt, updatedAt 
  }
);

export const User = mongoose.model("User", userSchema);