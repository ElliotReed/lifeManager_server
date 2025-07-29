import express from 'express';
import { Op } from 'sequelize';
import { endOfToday, startOfToday } from 'date-fns';

import db from '../../models/index';

const taskRouter = express.Router();

taskRouter.get("/", async (req, res, next) => {
  const filter = {
    where: { userId: { [Op.eq]: req.user.id } },
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: db.Rrule,
        required: false,
        attributes: { exclude: ["taskId"] },
      },
    ],
    order: [["dtStart", "ASC"]],
  };

  try {
    const tasks = await db.Task.findAll(filter);

    if (!tasks) throw new Error("No tasks were found!");

    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

taskRouter.get("/byforeign/:foreignId", async (req, res, next) => {
  const foreignId = req.params.foreignId;
  const filter = {
    where: {
      foreignId: { [Op.eq]: foreignId },
      dtCompleted: {
        [Op.or]: {
          [Op.eq]: null,
          [Op.gte]: startOfToday(),
        },
      },
      dtStart: { [Op.lte]: endOfToday() },
    },
    attributes: { exclude: ["userId"] },
    include: [db.Rrule],
  };

  try {
    const taskList = await db.Task.findAll(filter);
    res.status(200).send(taskList);
  } catch (err) {
    res.status(500).send({ error: err.message });
    console.error(err);
  }
});

taskRouter.patch("/:taskId", async (req, res, next) => {
  const taskToSave = {
    ...req.body,
  };

  const filter = {
    where: {
      id: { [Op.eq]: req.params.taskId },
    },
    attributes: { exclude: ["userId"] },
  };

  try {
    const task = await db.Task.findOne(filter);
    task.update(taskToSave);

    if (!taskToSave.rrule) {
      return res.status(200).send(task);
    }

    const [rrule, created] = await db.Rrule.findOrCreate({
      where: {
        taskId: req.params.taskId,
      },
      defaults: {
        rule: taskToSave.rrule.rule,
      },
    });

    if (!created) {
      rrule.update(taskToSave.rrule);
    }

    const taskWithRRule = {
      ...task.dataValues,
      rrule: { ...rrule.dataValues },
    };

    res.status(200).send(taskWithRRule);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

taskRouter.post("/", async (req, res, next) => {
  const taskWithUser = { ...req.body, userId: req.user.id };

  try {
    const newTask = await db.Task.create(taskWithUser, {
      include: [db.Rrule],
    });
    res.status(201).send(newTask);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

taskRouter.delete("/:taskId", async (req, res, next) => {
  const id = req.params.taskId;

  const filter = {
    where: {
      id: { [Op.eq]: id },
    },
    include: [db.Rrule],
  };

  try {
    const result = await db.Task.destroy(filter);
    res.status(200).send({
      id: id,
      message: `${result} task with id "${id}" has been deleted`,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

taskRouter.delete("/rrule/:taskId", async (req, res, next) => {
  const filter = {
    where: {
      taskId: {
        [Op.eq]: req.params.taskId,
      },
    },
  };

  try {
    const result = await db.Rrule.destroy(filter);
    console.log("result: ", result);
    res.status(200).send({ message: "rrule removed", itemsRemoved: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default taskRouter;
