
import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import process from 'process';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);

const db: { [key: string]: any } = {};

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

const modelFiles = fs.readdirSync(__dirname).filter(
  (file) =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
);

for (const file of modelFiles) {
  const filePath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href;
  const { default: model } = await import(fileUrl);
  const initializedModel = model(sequelize, DataTypes);
  db[initializedModel.name] = initializedModel;
}

// Ensure all models are in `db` before running associations
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
