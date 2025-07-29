import bcrypt from 'bcryptjs';
import express from 'express';
import { Op } from 'sequelize';

import db from '../../models/index';

import { getRefreshCookieKey } from './config.js';
import authenticate from './authenticate.js';
import setResponseCredentials from './setResponseCredentials.js';
import { loginValidation, registerValidation } from './validation.js';

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error)
    // Joi error message
    return res.status(400).json({ error: `${error.details[0].message}` });

  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({
      where: {
        email: { [Op.eq]: email },
      },
    });

    if (user)
      throw new Error(`The email address "${email}" is already registered`);

    const saltRounds = 12;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    });

    if (!newUser)
      throw new Error(`An error occured while adding the user to the database`);

    delete newUser.dataValues.password;
    res.status(201).send(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error)
    // Joi error message
    return res.status(400).json({ error: `${error.details[0].message}` });

  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({
      where: { email: { [Op.eq]: email } },
    });

    if (!user) throw new Error(`No user with email ${email} exists`);

    const validPassword = await bcrypt.compareSync(password, user.password);
    if (!validPassword) throw new Error("Incorrect password");

    setResponseCredentials(user, res);

    delete user.dataValues.password;
    res.status(200).send(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie(getRefreshCookieKey());
  res.sendStatus(204);
});

authRouter.get("/tokens", authenticate, async (req, res) => {
  try {
    const userData = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.status(200).send(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default authRouter;
