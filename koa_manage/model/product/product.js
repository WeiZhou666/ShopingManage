import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

// 商品模型
// status: 1-上架 0-下架
const product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  category: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    get() {
      const val = this.getDataValue('price')
      return val === null ? 0 : Number(val)
    }
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
  stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  create_time: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'create_time'
  }
}, {
  tableName: 'products',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // name：商品名称模糊搜索
    { fields: ['name'] },
    // category：分类筛选
    { fields: ['category'] },
    // status：上下架状态筛选
    { fields: ['status'] }
  ]
})

export default product
