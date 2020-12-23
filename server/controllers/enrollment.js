const Enrollment = require("../models/Enrollment");
const { errorHandler } = require("../helpers/errorHandler");

//create enrollment
exports.createEnrollment = async (req, res) => {
  let newEnrollment = { course: req.course, student: req.auth };

  newEnrollment.lessonStatus = req.course.lessons.map((lesson) => {
    return { lesson, complete: false };
  });

  const enrollment = new Enrollment(newEnrollment);

  try {
    const result = await enrollment.save();

    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//enrollment id
exports.enrollmentId = async (req, res, next, id) => {
  try {
    const enrollment = await Enrollment.findById(id)
      .populate({ path: "course", populate: { path: "instructor" } })
      .populate("student", "_id name");

    if (!enrollment) {
      return res.status("400").json({
        error: "Enrollment not found",
      });
    }

    req.enrollment = enrollment;
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//get enrollment by id
exports.readEnrollment = (req, res) => {
  return res.json(req.enrollment);
};

//complete
exports.completeEnrollment = async (req, res) => {
  let updated = {};
  updated["lessonStatus.$.complete"] = req.body.complete;

  if (req.body.courseCompleted) {
    updated.complete = req.body.courseCompleted;
  }

  try {
    const enrollment = await Enrollment.updateOne(
      {
        "lessonStatus._id": req.body.lessonStatus,
      },
      { $set: updated }
    );

    res.json(enrollment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = req.enrollment;
    const deleteEnroll = await enrollment.remove();
    res.json(deleteEnroll);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//is student
exports.isStudent = (req, res, next) => {
  const student = req.auth && req.auth._id == req.enrollment.student._id;

  if (!student) {
    return res.status(403).json({
      error: "user is not enrolled",
    });
  }
  next();
};

//enroll all
exports.getAllEnrolled = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.auth._id })
      .sort({ completed: 1 })
      .populate("course", "_id name category");

    res.json(enrollments);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//get Enrolled
exports.getEnrollment = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      course: req.course._id,
      student: req.auth._id,
    });

    if (enrollments.length == 0) {
      next();
    } else {
      res.json(enrollments[0]);
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

//enrollemt status
exports.enrollmentStats = async (req, res) => {
  try {
    let stats = {};
    stats.totalEnrolled = await Enrollment.find({
      course: req.course._id,
    }).countDocuments();

    stats.totalComplete = await Enrollment.find({ course: req.course._id })
      .exists("completed", true)
      .countDocuments();

    res.json(stats);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
