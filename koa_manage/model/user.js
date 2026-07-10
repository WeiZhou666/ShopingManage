import sequelize from '../config/db.js'
import { Sequelize } from 'sequelize'

const user = sequelize.define('user', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nickname: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING(11),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  registerTime: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'register_time'
  },
  lastLoginTime: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'last_login_time'
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  tags: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  totalConsumption: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_consumption',
    get() {
      const val = this.getDataValue('totalConsumption')
      return val === null ? 0 : Number(val)
    }
  },
  orderCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'order_count'
  }
}, {
  tableName: 'users',
  freezeTableName: true,
  timestamps: false
})

export default user
