import log4js from 'log4js'
import fs from 'fs'
import path from 'path'


// log4js 配置
log4js.configure({
  appenders: {
    // 控制台输出
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} [%-5p] %m'
      }
    },

    // 所有日志（按天分割）
    allFile: {
      type: 'dateFile',
      filename: 'logs/all',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      keepFileExt: true
    },

    // 错误日志单独文件
    errorFile: {
      type: 'dateFile',
      filename: 'logs/error',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      keepFileExt: true
    },

    // 只输出 error 级别
    errorFilter: {
      type: 'logLevelFilter',
      appender: 'errorFile',
      level: 'error'
    }
  },

  categories: {
    default: {
      appenders: ['console', 'allFile', 'errorFilter'],
      level: 'info' // 全局日志级别
    }
  }
});

// 【重点】只获取一次 logger，避免重复创建
const logger = log4js.getLogger();

/**
 * 日志输出（优化封装）
 */
export const debug = (context) => {
  logger.debug(context);
};

export const info = (context) => {
  logger.info(context);
};

export const warn = (context) => {
  logger.warn(context);
};

export const error = (context) => {
  logger.error(context);
};

export const fatal = (context) => {
  logger.fatal(context);
};

export default logger