import PostgresSequelize from './../connector/postgres/index.js'
import { DataTypes } from 'sequelize'

const Model = PostgresSequelize.define('store_settings', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  shop: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'compositeIndex',
  },
  accessToken: {
    type: DataTypes.STRING,
  },
  scope: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  planName: {
    type: DataTypes.STRING,
  },
  shopOwner: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('RUNNING', 'UNINSTALLED'),
    defaultValue: 'RUNNING',
  },
  acceptedAt: {
    type: DataTypes.DATE,
  },
  appPlan: {
    type: DataTypes.ENUM('BASIC', 'PRO', 'PLUS'),
    defaultValue: 'BASIC',
  },
  testStore: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.ENUM('GUEST', 'MEMBERSHIP', 'ADMIN'),
    defaultValue: 'GUEST',
  },
  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  billings: {
    type: DataTypes.JSON,
    defaultValue: null,
  },
})

Model.prototype.toJSON = function () {
  let values = Object.assign({}, this.get())

  values.billings = values.billings ? JSON.parse(values.billings) : []

  return values
}

Model.sync()

export default Model
