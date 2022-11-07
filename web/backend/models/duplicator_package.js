import PostgresSequelize from '../connector/postgres/index.js'
import { DataTypes } from 'sequelize'

const Model = PostgresSequelize.define('duplicator_packages', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'ARCHIVED'),
    defaultValue: 'ACTIVE',
  },
  versions: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    defaultValue: [],
  },
})

Model.prototype.toJSON = function () {
  let values = Object.assign({}, this.get())

  return values
}

Model.sync()

export default Model
