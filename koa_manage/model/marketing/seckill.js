import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

// 秒杀活动模型
// status: pending-未开始 active-进行中 ended-已结束
const seckill = sequelize.define('seckill', {
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
  seckill_price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'seckill_price',
    get() {
      const val = this.getDataValue('seckill_price')
      return val === null ? 0 : Number(val)
    }
  },
  seckill_stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'seckill_stock'
  },
  limit_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'limit_quantity'
  },
  sold_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sold_quantity'
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
  tableName: 'seckills',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // name：秒杀活动名称模糊搜索
    { fields: ['name'] },
    // status：状态筛选
    { fields: ['status'] },
    // product_id：关联商品查询
    { fields: ['product_id'] }
  ]
})

export default seckill
