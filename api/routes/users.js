const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");

const db = require("../../models");
const { Op } = require("sequelize");

const {
  registerValidation,
  loginValidation,
} = require("../authService/validation");

/* GET users listing. */
userRouter.get("/", async function (req, res, next) {
  const users = await db.user.findAll();
  users.map(user => delete user.dataValues.password);
  res.send(users);
});

userRouter.get("/user", async (req, res, next) => {
  const userId = req.user.id;

  const user = await db.user.findOne({
    where: {
      id: { [Op.eq]: userId },
    },
  });

  if (!user) throw new Error("User doesn't exist");

  delete user.dataValues.password;
  res.status(200).json(user);
});

module.exports = userRouter;
