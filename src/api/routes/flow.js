import express from 'express';
import db from '../../models/index.js';
import { Op } from 'sequelize';

const flowRouter = express.Router();

// Since flow is ordered by dtCompleted, updating the flow requires resetting the dtCompleted to null NOT IMPLEMENTED (other solutions?)
// if setting date to null, get order for dtCompleted should be "ASC NULLS FIRST"

flowRouter.get("/", async function (req, res, next) {
  const filter = {
    where: {
      userId: { [Op.eq]: req.user.id },
    },
    include: [{ model: db.aspect, required: true, attributes: ["name"] }],
    order: [
      ["dtCompleted", "ASC NULLS FIRST"],
      ["flow", "ASC"],
    ],
  };

  try {
    const flow = await db.flow.findAll(filter);
    res.status(200).send(flow);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});


flowRouter.post("/", async (req, res, next) => {
  const id = req.user.id;
  let flowItemWithUser = {};
  let numberOfFlowItems;

  try {
    numberOfFlowItems = await db.flow.findAndCountAll({
      where: {
        userId: { [Op.eq]: id },
      },
    });
  } catch (err) {
    res.status(409).send({ error: err.message });
  }

  flowItemWithUser = {
    userId: id,
    flow: numberOfFlowItems.count + 1,
    ...req.body,
  };
  try {
    const newflowItem = await db.flow.create(flowItemWithUser);
    if (!newflowItem) throw new Error("flow creation failed");
    res.status(201).send(newflowItem);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

flowRouter.patch("/:actionId", async (req, res, next) => {
  try {
    const action = await db.flow.findByPk(req.params.actionId, {
      include: [{ model: db.aspect, required: true }],
    });

    if (!action) throw new Error("No action to update");

    action.update(req.body);

    res.status(200).send(action);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

export default flowRouter;
