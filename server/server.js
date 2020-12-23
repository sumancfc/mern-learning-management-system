const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

//database connection
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    throw new Error("unable to connect to database");
  });

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(compress());
app.use(helmet());
app.use(cors());

//routes middleware
app.use("/api", userRoutes);
app.use("/api", authRoutes);

//error middleware
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
  next();
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
