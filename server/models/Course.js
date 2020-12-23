const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const lessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String,
});

module.exports = mongoose.model("Lesson", lessonSchema);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
      unique: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: "Category is required",
    },
    instructor: { type: ObjectId, ref: "User" },
    published: {
      type: Boolean,
      default: false,
    },
    lessons: { type: [lessonSchema] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
