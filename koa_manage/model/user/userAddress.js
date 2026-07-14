import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

const userAddress = sequelize.define('user_address', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING(11),
    allowNull: false
  },
  address: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  is_default: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'user_addresses',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // 按 user_id 查询某用户的全部地址
    { fields: ['user_id'] }
  ]
})

export default userAddress
