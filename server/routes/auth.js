const express = require("express");

const router = express.Router();

const { signIn, signOut } = require("../controllers/auth");

router.route("/auth/signin").post(signIn);
router.route("/auth/singout").get(signOut);

module.exports = router;
