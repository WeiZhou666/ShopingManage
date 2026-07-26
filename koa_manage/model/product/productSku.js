import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

// 商品 SKU 模型
const productSku = sequelize.define('product_sku', {
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
  spec: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    get() {
      const val = this.getDataValue('price')
      return val === null ? 0 : Number(val)
    }
  }
}, {
  tableName: 'product_skus',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // 按 product_id 查询某商品的全部 SKU
    { fields: ['product_id'] }
  ]
})

export default productSku
