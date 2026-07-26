import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

// 限时折扣模型
// status: pending-未开始 active-进行中 ended-已结束
const discount = sequelize.define('discount', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'product_id'
  },
  product_name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'product_name'
  },
  original_price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'original_price',
    get() {
      const val = this.getDataValue('original_price')
      return val === null ? 0 : Number(val)
    }
  },
  discount_price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'discount_price',
    get() {
      const val = this.getDataValue('discount_price')
      return val === null ? 0 : Number(val)
    }
  },
  discount_rate: {
    type: Sequelize.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'discount_rate',
    get() {
      const val = this.getDataValue('discount_rate')
      return val === null ? 0 : Number(val)
    }
  },
  active_period: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'active_period'
  },
  status: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'discounts',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // product_name：商品名称模糊搜索
    { fields: ['product_name'] },
    // status：状态筛选
    { fields: ['status'] },
    // product_id：关联商品查询
    { fields: ['product_id'] }
  ]
})

export default discount
