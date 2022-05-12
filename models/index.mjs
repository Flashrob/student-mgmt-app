import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../db/config/config.js';
import initContractModel from './contract.mjs';
import initUserModel from './user.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

let sequelize;

if (env === 'production') {
  // break apart the Heroku database url and rebuild the configs we need

  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);

  const host = dbUrl.hostname;
  const { port } = dbUrl;

  config.host = host;
  config.port = port;

  sequelize = new Sequelize(dbName, username, password, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.User = initUserModel(sequelize, Sequelize.DataTypes);
db.Contract = initContractModel(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Contract, {
  as: 'jobs',
  foreignKey: 'teacherId',
});

db.User.hasMany(db.Contract, {
  as: 'classes',
  foreignKey: 'parentId',
});

db.Contract.belongsTo(db.User, {
  as: 'teacher',
  foreignKey: 'teacherId',
});

db.Contract.belongsTo(db.User, {
  as: 'parent',
  foreignKey: 'parentId',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
