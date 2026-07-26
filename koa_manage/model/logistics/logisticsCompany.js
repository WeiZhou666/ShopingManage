import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

// 物流公司模型
// status: 1-启用 0-停用
const logisticsCompany = sequelize.define('logistics_company', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  code: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true
  },
  website: {
    type: Sequelize.STRING(200),
    allowNull: true
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  create_time: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'create_time'
  }
}, {
  tableName: 'logistics_companies',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // name：物流公司名称模糊搜索
    { fields: ['name'] },
    // status：启用/停用状态筛选
    { fields: ['status'] }
  ]
})

export default logisticsCompany
