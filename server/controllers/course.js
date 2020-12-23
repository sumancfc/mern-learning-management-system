const Course = require("../models/Course");
const extend = require("lodash/extend");
const fs = require("fs");
const formidable = require("formidable");
const { errorHandler } = require("../helpers/errorHandler");

//create course
exports.createCourse = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.this.status(400).json({
        error: "Image could not be uploaded!",
      });
    }

    let course = new Course(fields);
    course.instructor = req.profile;
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }

    try {
      const result = await course.save();
      res.json(result);
    } catch (err) {
      //       console.log(err);
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
  });
};

//course by id
exports.courseId = async (req, res, next, id) => {
  try {
    const course = await Course.findById(id).populate("instructor", "_id name");

    if (!course) {
      return res.status(400).json({
        error: "Course not found",
      });
    }

    req.course = course;
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//all courses
exports.allCourses = async (req, res) => {
  try {
    const courses = await Course.find().select(
      "name description updatedAt createdAt"
    );

    res.json(courses);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//single course
exports.getCourse = (req, res) => {
  req.course.image = undefined;
  return res.json(req.course);
};

//update course
exports.updateCourse = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }

    let course = req.course;
    course = extend(course, fields);

    if (fields.lessons) {
      course.lessons = JSON.parse(fields.lessons);
    }

    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }

    try {
      await course.save();
      res.json(course);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
  });
};

//delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = req.course;
    const courseDelete = await course.remove();
    res.json(courseDelete);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//create new lesson
exports.createLesson = async (req, res) => {
  try {
    let lesson = req.body.lesson;
    let result = await Course.findByIdAndUpdate(
      req.course._id,
      { $push: { lessons: lesson } },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//is instructor
exports.isInstructor = (req, res, next) => {
  const instructor =
    req.course && req.auth && req.course.instructor._id == req.auth._id;

  if (!instructor) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }

  next();
};

//course by instructor
exports.courseByInstructor = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.profile._id }).populate(
      "instructor",
      "_id name"
    );
    res.json(courses);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//course published
exports.published = async (req, res) => {
  try {
    const courses = await Course.find({ published: true }).populate(
      "instructor",
      "_id name"
    );
    res.json(courses);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//course photo
exports.photo = (req, res, next) => {
  if (req.course.image.data) {
    res.set("Content-Type", req.course.image.contentType);
    return res.send(req.course.image.data);
  }
  next();
};
