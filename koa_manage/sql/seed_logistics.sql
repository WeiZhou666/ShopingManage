-- ============================================
-- 物流公司 + 发货记录测试数据
-- 物流公司 6 条，发货记录 8 条
-- logistics_companies.status: 1-启用 0-停用
-- shipment_records.status: 已签收/运输中/已发货/异常
-- 执行前请确认数据库 ShopingManage 已存在
-- ============================================

USE ShopingManage;

-- 清空旧数据（首次执行可省略）
-- TRUNCATE TABLE shipment_records;
-- TRUNCATE TABLE logistics_companies;

INSERT INTO logistics_companies (id, name, code, website, status, create_time) VALUES
(1, '顺丰速运',   'SF',  'https://www.sf-express.com',  1, '2024-01-01'),
(2, '中通快递',   'ZTO', 'https://www.zto.com',          1, '2024-01-01'),
(3, '圆通速递',   'YTO', 'https://www.yto.net.cn',       1, '2024-01-01'),
(4, '韵达快递',   'YD',  'https://www.yundaex.com',      1, '2024-01-01'),
(5, '京东物流',   'JD',  'https://www.jdl.com',          1, '2024-01-01'),
(6, '申通快递',   'STO', 'https://www.sto.cn',           0, '2024-01-01');

INSERT INTO shipment_records (id, order_no, receiver_name, company_code, company_name, tracking_no, shipment_time, operator, status) VALUES
(1, 'DD20240720001', '张三',   'SF',  '顺丰速运', 'SF1234567890', '2024-07-20 14:30:00', '李订单', '已签收'),
(2, 'DD20240720002', '李四',   'JD',  '京东物流', 'JD0987654321', '2024-07-21 09:15:00', '李订单', '运输中'),
(3, 'DD20240720003', '王五',   'ZTO', '中通快递', 'ZT1111222233', '2024-07-20 16:00:00', '李订单', '已签收'),
(4, 'DD20240721003', '孙八',   'YTO', '圆通速递', 'YT5555666677', '2024-07-22 08:30:00', '周订单', '运输中'),
(5, 'DD20240722003', '郑十一', 'SF',  '顺丰速运', 'SF9999888877', '2024-07-22 15:00:00', '李订单', '已签收'),
(6, 'DD20240723001', '王十二', 'JD',  '京东物流', 'JD3333444455', '2024-07-23 16:30:00', '周订单', '已签收'),
(7, 'DD20240723002', '冯十三', 'YD',  '韵达快递', 'YD2222333344', '2024-07-24 09:00:00', '李订单', '运输中'),
(8, 'DD20240724002', '卫十六', 'ZTO', '中通快递', 'ZT6666777788', '2024-07-24 14:00:00', '周订单', '已发货');

-- 验证
SELECT id, name, code, status FROM logistics_companies ORDER BY id;
SELECT id, order_no, company_name, tracking_no, status FROM shipment_records ORDER BY shipment_time DESC;
