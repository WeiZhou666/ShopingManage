import { Sequelize } from 'sequelize';
import logger from '../util/log4js.js'// 引入日志模块
const sequelize = new Sequelize('ShopingManage', 'root', '009096', {
  host: 'localhost',
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