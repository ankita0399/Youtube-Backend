import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String
    },
    city:{
      type: String,
      required: true
    },
    pincode:{
      type: String,
      required: true
    },
    state:{
      type: String,
      required: true
    },
    country:{
      type: String,
      required: true
    },
    diagnosedWith: {
      type: String,
      required: true
    },
    admittedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },
    medicalHistory: [
      {
        type: String,
      }
    ],
    prescribedMedicines: [
      {
        type: String,
      }
    ],
    medicalTests: [
      {
        type: String,
      }
    ],
    medicalReports: [
      {
        type: String,
      }
    ],
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);