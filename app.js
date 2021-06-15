require("dotenv/config");
var cookieParser = require("cookie-parser");
const cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
var path = require("path");

const api = require("./api");

var app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_CLIENT
      : process.env.LOCAL_CLIENT,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});

module.exports = app;
