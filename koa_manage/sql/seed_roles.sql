-- ============================================
-- 角色表建表 + 初始化数据（5 条）
-- 字段名与 roles 表完全对齐（snake_case）
-- 执行前请确认数据库 ShopingManage 已存在
-- 角色编码与前端权限映射保持一致，不可随意变更
-- ============================================

USE ShopingManage;

-- 建表（已存在则跳过）
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(30) NOT NULL,
  `name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 清空旧数据（首次执行可省略）
-- TRUNCATE TABLE roles;

INSERT INTO roles (id, code, name) VALUES
(1, 'super_admin',       '超级管理员'),
(2, 'operator',          '运营人员'),
(3, 'order_staff',       '订单专员'),
(4, 'finance',           '财务人员'),
(5, 'customer_service',  '普通客服');

-- 验证
SELECT * FROM roles;
