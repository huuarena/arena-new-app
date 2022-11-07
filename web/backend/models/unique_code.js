import PostgresSequelize from '../connector/postgres/index.js'
import { DataTypes } from 'sequelize'

const Model = PostgresSequelize.define('unique_codes', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  shop: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  permission: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ALL',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  description: {
    type: DataTypes.STRING,
  },
})

Model.prototype.toJSON = function () {
  let values = Object.assign({}, this.get())

  return values
}

Model.sync()

export default Model
