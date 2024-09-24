require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const { sendResponse } = require("./helpers/utils");
const mongoURI = process.env.MONGO_DEV_URI;

const app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

/* DB Connection */
mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected`))
  .catch((err) => console.log(err));

app.use("/api", indexRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  console.log("🐳 Helen 🍄 -- app.use -- req:", req.body);
  console.log("ERROR", err);
  if (err.isOperational) {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      err.errorType
    );
  } else {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      "Internal Server Error"
    );
  }
});

module.exports = app;
