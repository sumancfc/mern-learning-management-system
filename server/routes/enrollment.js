const express = require("express");

const router = express.Router();

const { requireSignin } = require("../controllers/auth");
const { courseId } = require("../controllers/course");
const {
  getAllEnrolled,
  getEnrollment,
  createEnrollment,
  enrollmentStats,
  completeEnrollment,
  isStudent,
  readEnrollment,
  deleteEnrollment,
  enrollmentId,
} = require("../controllers/enrollment");

router.route("/enrollment/enrolled").get(requireSignin, getAllEnrolled);

router
  .route("/enrollment/new/:courseId")
  .post(requireSignin, getEnrollment, createEnrollment);

router.route("/enrollment/status/:courseId").get(enrollmentStats);

router
  .route("/enrollment/complete/:enrollmentId")
  .put(requireSignin, isStudent, completeEnrollment);

router
  .route("/enrollment/:enrollmentId")
  .get(requireSignin, isStudent, readEnrollment)
  .delete(requireSignin, isStudent, deleteEnrollment);

router.param("enrollmentId", enrollmentId);
router.param("courseId", courseId);

module.exports = router;
