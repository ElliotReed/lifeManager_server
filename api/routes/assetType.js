const assetTypeRouter = require("express").Router();

const db = require("../../models");
const { Op } = require("sequelize");

assetTypeRouter.get("/", async (req, res, next) => {
  console.log("req.user: ", req.user);
  const filter = {
    // where: {
    //   userId: { [Op.eq]: req.user.id },
    // },
    order: [["label", "ASC"]],
  };

  try {
    const assetTypes = await db.assetType.findAll(filter);
    if (!assetTypes) throw new Error("types not found");
    res.status(200).send(assetTypes);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = assetTypeRouter;
