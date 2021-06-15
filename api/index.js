const express = require("express");
const api = express();

const aspectRouter = require("./routes/aspect");
const flowRouter = require("./routes/flow");
const authService = require("./authService");
const taskRouter = require("./routes/tasks");
const userRouter = require("./routes/users");
const vehicleMaintenenceRouter = require("./routes/vehicleMaintenence");

api.get("/", (req, res) => {
  res.send({
    message: "Hello from the API",
  });
});

api.use("/auth", authService.authRouter);
api.use(authService.authenticate);

api.use("/aspect", aspectRouter);
api.use("/flow", flowRouter);
api.use("/tasks", taskRouter);
api.use("/users", userRouter);
api.use("/vehicles/maintenence", vehicleMaintenenceRouter);

module.exports = api;
