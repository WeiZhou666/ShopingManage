-- ============================================
-- 员工表建表 + 测试数据（8 条）
-- 字段名与 staff 表完全对齐（snake_case）
-- status: '1'=启用 '0'=禁用
-- 密码明文统一为 123456（bcrypt 加密）
-- 执行前请确认：
--   1. 数据库 ShopingManage 已存在
--   2. roles 表已插入初始化数据（见 seed_roles.sql 或设计文档第十一节）
--      role_id 映射: 1=超级管理员 2=运营人员 3=订单专员 4=财务人员 5=普通客服
-- ============================================

USE ShopingManage;

-- 建表（已存在则跳过）
CREATE TABLE IF NOT EXISTS `staff` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `employee_no` VARCHAR(10) NOT NULL,
  `name` VARCHAR(20) NOT NULL,
  `account` VARCHAR(30) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(11) NOT NULL,
  `role_id` INT NOT NULL,
  `status` VARCHAR(1) NOT NULL DEFAULT '1',
  `last_login` DATETIME NULL,
  `first_login` TINYINT NOT NULL DEFAULT 1,
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_no` (`employee_no`),
  UNIQUE KEY `account` (`account`),
  KEY `idx_name` (`name`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 清空旧数据（首次执行可省略）
-- TRUNCATE TABLE staff;

INSERT INTO staff (id, employee_no, name, account, password, phone, role_id, status, last_login, first_login, create_time) VALUES
(1, 'EMP001', '管理员',   'admin',        '$2b$10$a1QrCK3BMRpJJ8EbanrX5e1hYSNg1v0arwKHEhUqW68IVD3vyfa1i', '13900139001', 1, '1', '2026-07-18 08:30:00', 0, '2024-01-01 09:00:00'),
(2, 'EMP002', '张运营',   'zhangyunying', '$2b$10$a1QrCK3BMRpJJ8EbanrX5e1hYSNg1v0arwKHEhUqW68IVD3vyfa1i', '13900139002', 2, '1', '2026-07-17 17:45:00', 0, '2024-01-10 09:00:00'),
(3, 'EMP003', '李订单',   'lidingdan',    '$2b$10$a1QrCK3BMRpJJ8EbanrX5e1hYSNg1v0arwKHEhUqW68IVD3vyfa1i', '13900139003', 3, '1', '2026-07-18 09:15:00', 0, '2024-02-01 09:00:00'),
(4, 'EMP004', '王财务',   'wangcaiwu',    '$2b$10$a1QrCK3BMRpJJ8EbanrX5e1hYSNg1v0arwKHEhUqW68IVD3vyfa1i', '13900139004', 4, '1', '2026-07-16 16:20:00', 0, '2024-02-15 09:00:00'),
(5, 'EMP005', '赵客服',   'zhaokefu',     '$2b$10$a1QrCK3BMRpJJ8EbanrX5e1hYSNg1v0arwKHEhUqW68IVD3vyfa1i', '13900139005', 5, '1', '2026-07-18 10:00:00', 0, '2024-03-01 09:00:00'),
(6, 'EMP006', '钱客服',   'qiankefu',     '$2b$10$a1QrCK3BMRpJJ8EbanrX5e1hYSNg1v0arwKHEhUqW68IVD3vyfa1i', '13900139006', 5, '1', '2026-07-17 14:30:00', 0, '2024-03-10 09:00:00'),
(7, 'EMP007', '孙运营',   'sunyunying',   '$2b$10$a1QrCK3BMRpJJ8EbanrX5e1hYSNg1v0arwKHEhUqW68IVD3vyfa1i', '13900139007', 2, '0', NULL,                 0, '2024-04-01 09:00:00'),
(8, 'EMP008', '周订单',   'zhoudingdan',  '$2b$10$a1QrCK3BMRpJJ8EbanrX5e1hYSNg1v0arwKHEhUqW68IVD3vyfa1i', '13900139008', 3, '1', '2026-07-15 11:10:00', 0, '2024-04-10 09:00:00');

-- 验证
SELECT id, employee_no, name, account, role_id, status FROM staff;
