import express from 'express';

import aspectRouter from './routes/aspect.js';
import assetRouter from './routes/asset.js';
import assetTypeRouter from './routes/assetType.js';
import flowRouter from './routes/flow.js';
import * as authService from './authService/index.js';
import taskRouter from './routes/tasks.js';
import userRouter from './routes/users.js';
import vehicleMaintenenceRouter from './routes/vehicleMaintenence.js';

const api = express();

api.get("/", (req, res) => {
  res.send({
    message: "Hello from the API",
  });
});

api.use("/auth", authService.authRouter);
api.use(authService.authenticate);

api.use("/aspect", aspectRouter);
api.use("/assets", assetRouter);
api.use("/assetTypes", assetTypeRouter);
api.use("/flow", flowRouter);
api.use("/tasks", taskRouter);
api.use("/users", userRouter);
api.use("/vehicles/maintenence", vehicleMaintenenceRouter);

export default api;
