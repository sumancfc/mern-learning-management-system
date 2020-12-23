const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//User signin
exports.signIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status("401").json({ error: "User not found" });

    if (!user.authenticate(req.body.password)) {
      return res
        .status("401")
        .send({ error: "Email and  password don't match." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status("401").json({ error: "Could not sign in" });
  }
};

//User signout
exports.signOut = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "Signout Success",
  });
};

//User require signin
exports.requireSignin = expressJwt({
  secret: process.env.SECRET_KEY,
  algorithms: ["HS256"],
  userProperty: "auth",
});

//User has Authorization
exports.authCheck = (req, res, next) => {
  const authUser = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!authUser) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }

  next();
};

//User is admin
exports.adminCheck = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource! access denied",
    });
  }
  next();
};
