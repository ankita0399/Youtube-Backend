import mongoose from "mongoose";

// const hospitalHoursSchema = new mongoose.Schema(
//   {
//     day: {
//       type: String,
//       required: true
//     },
//     open: {
//       type: String,
//       required: true
//     },
//     close: {
//       type: String,
//       required: true
//     }
//   }
// );

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    salary: {
      type: String,
      required: true
    },
    qualification: {
      type: String,
      required: true
    },
    experienceInYears: {
      type: Number,
      default: 0
    },
    worksInHospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true
      },
    ]
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);