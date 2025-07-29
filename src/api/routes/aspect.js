import express from 'express';
import db from '../../models/index';
import { Op } from 'sequelize';

const aspectRouter = express.Router();


aspectRouter.get("/", async function (req, res, next) {
  const filter = {
    where: {
      userId: { [Op.eq]: req.user.id },
    },
    order: [["name", "ASC"]],
  };

  try {
    const aspects = await db.Aspect.findAll(filter);
    res.status(200).send(aspects);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

aspectRouter.post("/", async (req, res, next) => {
  const aspectWithUser = { userId: req.user.id, ...req.body };
  console.log("aspectWithUser: ", aspectWithUser);
  try {
    const newAspect = await db.Aspect.create(aspectWithUser);
    if (!newAspect) throw new Error("Aspect creation failed");
    res.status(201).send(newAspect);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

export default aspectRouter;
