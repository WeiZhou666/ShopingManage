import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

const staff = sequelize.define('staff', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  employee_no: {
    type: Sequelize.STRING(10),
    allowNull: false,
    unique: true,
    field: 'employee_no'
  },
  name: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  account: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: false,
    field: 'password'
  },
  phone: {
    type: Sequelize.STRING(11),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: true,
    field: 'email'
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'role_id'
  },
  status: {
    type: Sequelize.STRING(1),
    allowNull: false,
    defaultValue: '1',
    field: 'status'
  },
  last_login: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'last_login'
  },
  first_login: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1,
    field: 'first_login'
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'create_time'
  }
}, {
  tableName: 'staff',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    { fields: ['name'] },
    { fields: ['account'] },
    { fields: ['role_id'] },
    { fields: ['status'] }
  ]
})

export default staff
