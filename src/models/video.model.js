import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //We will be using cloudinary url for the video
      required: true
    },
    thumbnail: {
      type: String, //We will be using cloudinary url for the image
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number, //We will get this from the video file stored in cloudinary
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

videoSchema.plugin(mongooseAggregatePaginate); // Use mongoose-aggregate-paginate-v2 plugin to enable pagination for the videos

export const Video = mongoose.model("Video", videoSchema);