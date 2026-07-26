import sequelize from '../../config/db.js'
import { Sequelize } from 'sequelize'

// 发货记录模型
// status: 已签收/运输中/已发货/异常
const shipmentRecord = sequelize.define('shipment_record', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  order_no: {
    type: Sequelize.STRING(30),
    allowNull: false,
    field: 'order_no'
  },
  receiver_name: {
    type: Sequelize.STRING(20),
    allowNull: false,
    field: 'receiver_name'
  },
  company_code: {
    type: Sequelize.STRING(20),
    allowNull: false,
    field: 'company_code'
  },
  company_name: {
    type: Sequelize.STRING(50),
    allowNull: false,
    field: 'company_name'
  },
  tracking_no: {
    type: Sequelize.STRING(50),
    allowNull: false,
    field: 'tracking_no'
  },
  shipment_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'shipment_time'
  },
  operator: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  status: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: '已发货'
  }
}, {
  tableName: 'shipment_records',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    // order_no：订单号模糊搜索
    { fields: ['order_no'] },
    // company_code：物流公司编码精确筛选
    { fields: ['company_code'] },
    // shipment_time：日期范围筛选 + 列表默认按发货时间倒序
    { fields: ['shipment_time'] }
  ]
})

export default shipmentRecord
