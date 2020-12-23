const express = require("express");

const router = express.Router();

const { requireSignin, authCheck } = require("../controllers/auth");
const { userId, isEducator } = require("../controllers/user");
const {
  createCourse,
  allCourses,
  courseId,
  courseByInstructor,
  photo,
  isInstructor,
  createLesson,
  updateCourse,
  deleteCourse,
  published,
  getCourse,
} = require("../controllers/course");

router
  .route("/courses/by/:userId")
  .post(requireSignin, authCheck, isEducator, createCourse)
  .get(requireSignin, authCheck, courseByInstructor);

router.route("/courses").get(allCourses);

router.route("/courses/photo/:courseId").get(photo);

router.route("/courses/published").get(published);

router
  .route("/courses/:courseId/lesson/create")
  .put(requireSignin, isInstructor, createLesson);

router
  .route("/courses/:courseId")
  .get(getCourse)
  .put(requireSignin, isInstructor, updateCourse)
  .delete(requireSignin, isInstructor, deleteCourse);

router.param("userId", userId);
router.param("courseId", courseId);

module.exports = router;
