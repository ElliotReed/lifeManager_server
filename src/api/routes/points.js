const pointRouter = require("express").Router();

const db = require("../../models");
const { Op } = require("sequelize");

pointRouter.get("/", async (req, res, next) => {
  console.log("get points");
});

pointRouter.patch("/:pointId", async (req, res, next) => {
  console.log("patch points");
});

module.exports = pointRouter;
