const express = require("express");

const router = express.Router();

const { requireSignin, authCheck } = require("../controllers/auth");
const {
  createUser,
  getUsers,
  userId,
  getUser,
  updateUser,
  deleteUser,
  photo,
} = require("../controllers/user");

router.route("/user/photo/:userId").get(photo);

router.route("/user/signup").post(createUser);
router.route("/users").get(getUsers);
router
  .route("/user/:userId")
  .get(requireSignin, getUser)
  .put(requireSignin, authCheck, updateUser)
  .delete(requireSignin, authCheck, deleteUser);

router.param("userId", userId);

module.exports = router;
