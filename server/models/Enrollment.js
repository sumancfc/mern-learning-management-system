const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const enrollmentSchema = new mongoose.Schema(
  {
    course: { type: ObjectId, ref: "Course" },
    enrolled: {
      type: Date,
      default: Date.now,
    },
    student: { type: ObjectId, ref: "User" },
    lessonStatus: [
      {
        lesson: { type: ObjectId, ref: "Lesson" },
        complete: Boolean,
      },
    ],
    completed: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
