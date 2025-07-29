import bcrypt from 'bcryptjs';
import express from 'express';
import { Op } from 'sequelize';

import db from '../../models/index';
import { registerValidation, loginValidation } from '../authService/validation.js';

const userRouter = express.Router();


/* GET users listing. */
userRouter.get("/", async function (req, res, next) {
  const users = await db.User.findAll();
  users.map(user => delete user.dataValues.password);
  res.send(users);
});

userRouter.get("/user", async (req, res, next) => {
  const userId = req.user.id;

  const user = await db.User.findOne({
    where: {
      id: { [Op.eq]: userId },
    },
  });

  if (!user) throw new Error("User doesn't exist");

  delete user.dataValues.password;
  res.status(200).json(user);
});

export default userRouter;
