const vehicleMaintenenceRouter = require("express").Router();

const db = require("../../models");
const { Op } = require("sequelize");

/* GET vehicleMaintenence listing. */
vehicleMaintenenceRouter.get("/", async (req, res, next) => {
  console.log("req.user: ", req.user);
  try {
    const vehicleMaintenences = await db.vehicleMaintenence.findAll({
      where: { userId: { [Op.eq]: req.user.id } },
      attributes: ["name", "id", "archive", "createdAt", "updatedAt"],
      order: [["name", "ASC"]],
    });

    if (!vehicleMaintenences) throw new Error("No vehicleMaintenences have been found");

    res.send(vehicleMaintenences);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

/* GET vehicleMaintenence */
vehicleMaintenenceRouter.get("/:vehicleMaintenenceId", async (req, res, next) => {
  const id = req.params.vehicleMaintenenceId;
  try {
    const vehicleMaintenence = await db.vehicleMaintenence.findOne({
      where: {
        id: { [Op.eq]: id },
      },
    });

    if (!vehicleMaintenence) throw new Error("vehicleMaintenence not found");

    res.status(200).send(vehicleMaintenence);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

vehicleMaintenenceRouter.patch("/:vehicleMaintenenceId", async (req, res, next) => {
  console.log("patch req");
  const id = req.params.vehicleMaintenenceId;
  try {
    const vehicleMaintenence = await db.vehicleMaintenence.findOne({
      where: {
        id: { [Op.eq]: id },
      },
    });
    vehicleMaintenence.update(req.body);
    res.status(200).send(vehicleMaintenence);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

vehicleMaintenenceRouter.post("/", async (req, res, next) => {
  const vehicleMaintenenceWithUser = { userId: req.user.id, ...req.body };
  console.log("vehicleMaintenenceWithUser: ", vehicleMaintenenceWithUser);
  try {
    const vehicleMaintenence = await db.vehicleMaintenence.findOne({
      where: {
        name: { [Op.eq]: req.body.name },
      },
    });

    if (vehicleMaintenence) throw new Error("vehicleMaintenence already exists");
    const newvehicleMaintenence = await db.vehicleMaintenence.create(vehicleMaintenenceWithUser);
    res.status(201).send(newvehicleMaintenence);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

vehicleMaintenenceRouter.delete("/:vehicleMaintenenceId", async (req, res, next) => {
  const id = req.params.vehicleMaintenenceId;
  console.log("id: ", id);
  try {
    const vehicleMaintenence = await db.vehicleMaintenence.findOne({
      where: {
        id: { [Op.eq]: id },
      },
    });

    if (!vehicleMaintenence) throw new Error("vehicleMaintenence doesn't exist");
    await vehicleMaintenence.destroy();
    res.status(200).send(id);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

module.exports = vehicleMaintenenceRouter;
