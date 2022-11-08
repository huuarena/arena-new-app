import PostgresSequelize from './../connector/postgres/index.js'
import { DataTypes } from 'sequelize'

const Model = PostgresSequelize.define('store_settings', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
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
  plan: {
    type: DataTypes.STRING,
  },
  owner: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING, // INSTALLED, RUNNING, UNINSTALLED, LOCKED
    defaultValue: 'INSTALLED',
  },
  acceptedAt: {
    type: DataTypes.DATE,
  },
  appPlan: {
    type: DataTypes.STRING, // BASIC, PRO, PLUS
    defaultValue: 'BASIC',
  },
  testStore: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  billings: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    defaultValue: null,
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: null,
  },
})

Model.prototype.toJSON = function () {
  let values = Object.assign({}, this.get())

  values.billings = values.billings ? values.billings : []
  values.permissions = values.permissions ? values.permissions : []

  return values
}

Model.sync({ alter: true })

export default Model
