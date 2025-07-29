import { Sequelize, DataTypes } from 'sequelize';

import User from './user';
import Aspect from './aspect';
import Asset from './asset';
import AssetType from './assetType';
import Flow from './flow';
import Points from './points';
import Rrule from './rrule';
import Task from './task';
import VehicleMaintenance from './vehicleMaintenance';

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

if (!dbName || !dbUsername || !dbPassword || !dbHost) {
  throw new Error('Database environment variables are not set properly.');
}

const sequelize = new Sequelize(
  dbName,
  dbUsername,
  dbPassword,
  {
    host: dbHost,
    dialect: 'postgres',
  }
);

const models = {
  User: User(sequelize, DataTypes),
  Aspect: Aspect(sequelize, DataTypes),
  Asset: Asset(sequelize, DataTypes),
  AssetType: AssetType(sequelize, DataTypes),
  Flow: Flow(sequelize, DataTypes),
  Points: Points(sequelize, DataTypes),
  Rrule: Rrule(sequelize, DataTypes),
  Task: Task(sequelize, DataTypes),
  VehicleMaintenance: VehicleMaintenance(sequelize, DataTypes),
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

const db = {
  ...models,
  sequelize,
  Sequelize,
};

export default db;