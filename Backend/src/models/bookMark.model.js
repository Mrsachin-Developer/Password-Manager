import mongoose from "mongoose";

const bookMarkerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      lowercase: true,
      trim: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const MarkerSchema = mongoose.model("MarkerSchema", bookMarkerSchema);
