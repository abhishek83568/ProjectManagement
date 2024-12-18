const mongoose = require("mongoose");
const projectTrackerSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Started", "InProgress", "Completed"],
      default: "Started",
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const ProjectTrackerModel = mongoose.model("status", projectTrackerSchema);

module.exports = ProjectTrackerModel;
