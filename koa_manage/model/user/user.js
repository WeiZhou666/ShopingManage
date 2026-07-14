import sequelize from '../../config/db.js'
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
  register_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    // field: 'register_time'
  },
  last_login_time: {
    type: Sequelize.DATE,
    allowNull: true,
    // field: 'last_login_time'
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
  total_consumption: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    get() {
      const val = this.getDataValue('total_consumption')
      return val === null ? 0 : Number(val)
    }
  },
  order_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'users',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // phone：唯一性校验 + keyword 搜索（唯一索引同时服务于这两个场景）
    { unique: true, fields: ['phone'] },
    // tags：用户标签筛选（1优质/2普通/3恶意）
    { fields: ['tags'] },
    // status：状态筛选（1正常/0禁用）
    { fields: ['status'] },
    // register_time：日期范围筛选 + 列表默认按注册时间倒序排序
    { fields: ['register_time'] }
  ]
})

export default user
