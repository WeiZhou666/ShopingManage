-- ============================================
-- 营销模块测试数据（优惠券 5 + 秒杀 4 + 折扣 4）
-- 字段名与 coupons / seckills / discounts 表完全对齐（snake_case）
-- coupon.type:     full_reduction-满减 discount-折扣
-- status(三表通用): pending-未开始 active-进行中 ended-已结束
-- 执行前请确认数据库 ShopingManage 已存在
-- ============================================

USE ShopingManage;

-- 清空旧数据（首次执行可省略）
-- TRUNCATE TABLE discounts;
-- TRUNCATE TABLE seckills;
-- TRUNCATE TABLE coupons;

-- ==================== 优惠券 ====================
INSERT INTO coupons (id, name, type, threshold, discount, total_quantity, received_quantity, used_quantity, valid_period, status) VALUES
(1, '新人立减券',     'full_reduction', 100.00,   20.00, 1000, 856, 620, '2024-07-01 ~ 2024-12-31', 'active'),
(2, '数码专区满减',   'full_reduction', 1000.00, 100.00, 500,  312, 198, '2024-07-15 ~ 2024-08-15', 'active'),
(3, '夏季折扣券',     'discount',       200.00,   0.85,  800,  800, 750, '2024-06-01 ~ 2024-07-31', 'ended'),
(4, '美妆满199减50',  'full_reduction', 199.00,   50.00, 300,  145,  88, '2024-08-01 ~ 2024-09-01', 'pending'),
(5, '全品类9折券',    'discount',       500.00,   0.90,  600,  420, 350, '2024-07-20 ~ 2024-08-20', 'active');

-- ==================== 秒杀活动 ====================
INSERT INTO seckills (id, name, product_id, product_name, original_price, seckill_price, seckill_stock, limit_quantity, sold_quantity, active_period, status) VALUES
(1, 'iPhone 15 Pro 限时秒杀',   1, 'iPhone 15 Pro 256G', 8999.00, 7999.00, 50, 1, 38, '2024-07-25 10:00 ~ 2024-07-25 12:00', 'pending'),
(2, 'AirPods Pro 2 秒杀',       3, 'AirPods Pro 2',      1899.00, 1499.00, 100, 2, 85, '2024-07-20 10:00 ~ 2024-07-20 14:00', 'ended'),
(3, 'MacBook Pro 限时抢购',      2, 'MacBook Pro 14寸',   14999.00, 12999.00, 20, 1, 15, '2024-07-28 20:00 ~ 2024-07-28 22:00', 'pending'),
(4, 'iPad Air 5 特惠秒杀',       4, 'iPad Air 5',         4399.00, 3899.00, 30, 1, 30, '2024-07-22 14:00 ~ 2024-07-22 16:00', 'ended');

-- ==================== 限时折扣 ====================
INSERT INTO discounts (id, product_id, product_name, original_price, discount_price, discount_rate, active_period, status) VALUES
(1, 7,  '纯棉短袖T恤',   99.00,  79.00,  0.80, '2024-07-20 ~ 2024-08-20', 'active'),
(2, 9,  '智能保温杯',    129.00, 99.00,  0.77, '2024-07-15 ~ 2024-08-15', 'active'),
(3, 11, '保湿面霜',      199.00, 159.00, 0.80, '2024-08-01 ~ 2024-09-01', 'pending'),
(4, 12, '蛋白粉 1kg',    299.00, 249.00, 0.83, '2024-07-01 ~ 2024-07-31', 'ended');

-- 验证
SELECT id, name, type, status FROM coupons ORDER BY id;
SELECT id, name, product_name, seckill_price, sold_quantity, status FROM seckills ORDER BY id;
SELECT id, product_name, discount_price, discount_rate, status FROM discounts ORDER BY id;
