import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

const roles = sequelize.define('roles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'roles',
  freezeTableName: true,
  timestamps: false
})

export default roles
