import { Sequelize } from 'sequelize';
import logger from '../util/log4js.js'// 引入日志模块

// 数据库配置从环境变量读取，未配置时给出警告并使用开发兜底值
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_NAME = process.env.DB_NAME || 'ShopingManage'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || ''

if (!process.env.DB_PASSWORD && process.env.NODE_ENV !== 'development') {
  console.warn('⚠️  警告：未设置 DB_PASSWORD 环境变量，数据库密码为空！')
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,//最大连接数
    min: 0,//最小连接数
    acquire: 30000,//获取连接超时时间
    idle: 10000//超过10秒没有使用，就关闭连接

  }
});
sequelize.authenticate().then(() => {
  logger.info('数据库连接成功');
}).catch((err) => {
  logger.error('数据库连接失败:', err);
});

//根据模型创建/更新表（alter:true 会同步新增字段，开发期使用）
sequelize.sync();

export default sequelize;