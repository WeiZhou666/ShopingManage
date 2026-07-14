import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

const operationLog = sequelize.define('operation_log', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  operator: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  action: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'operation_logs',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // 按用户查询操作日志并按时间倒序排列
    { fields: ['user_id', 'created_at'] }
  ]
})

export default operationLog
