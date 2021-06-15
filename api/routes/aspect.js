const aspectRouter = require("express").Router();

const db = require("../../models");
const { Op } = require("sequelize");

aspectRouter.get("/", async function (req, res, next) {
  const filter = {
    where: {
      userId: { [Op.eq]: req.user.id },
    },
    order: [["name", "ASC"]],
  };

  try {
    const aspects = await db.aspect.findAll(filter);
    res.status(200).send(aspects);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

aspectRouter.post("/", async (req, res, next) => {
  const aspectWithUser = { userId: req.user.id, ...req.body };
  console.log("aspectWithUser: ", aspectWithUser);
  try {
    const newAspect = await db.aspect.create(aspectWithUser);
    if (!newAspect) throw new Error("Aspect creation failed");
    res.status(201).send(newAspect);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

module.exports = aspectRouter;
