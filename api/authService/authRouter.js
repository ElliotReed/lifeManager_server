const authRouter = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../../models").user;
const { Op } = require("sequelize");

const authenticate = require("./authenticate");
const setResponseCredentials = require("./setResponseCredentials.js");
const { loginValidation, registerValidation } = require("./validation");

authRouter.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error)
    // Joi error message
    return res.status(400).json({ error: `${error.details[0].message}` });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({
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

    res.status(201).send({ email: newUser.email, password: password });
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
    const user = await User.findOne({
      where: { email: { [Op.eq]: email } },
    });

    if (!user) throw new Error(`No user with email ${email} exists`);

    const validPassword = await bcrypt.compareSync(password, user.password);
    if (!validPassword) throw new Error("Incorrect password");

    setResponseCredentials(user, res);

    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("refresh-token");
  res.sendStatus(204);
});

authRouter.get("/tokens", authenticate, async (req, res) => {
  res.sendStatus(200);
});

module.exports = authRouter;
