import 'dotenv/config';
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import createError from "http-errors";
import express from "express";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from 'url';

import api from "./api/index.js";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT,
  // origin: "https://lifemanager.elliotreed.net",
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public"));
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
  res.send(err.message || "Internal Server Error");
});

export default app;
