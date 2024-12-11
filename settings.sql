-- Active: @001_陈梓博_Restaurant

-- 如果没有创建数据库，先创建
-- CREATE DATABASE 001_陈梓博_restaurant;
-- USE 001_陈梓博_restaurant;

-- 角色权限表
CREATE TABLE Characterlimit(
Typeid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
Typename VARCHAR(10) NOT NULL COMMENT '仅作为id的注释'
);

-- 设置角色
INSERT INTO Characterlimit (Typename) VALUES 
('管理者'),
('服务员'),
('用户');

-- 用户信息表
CREATE TABLE EveryInfo(
Mytel CHAR(11) PRIMARY KEY NOT NULL,
Password VARCHAR(20),
Limitid INT NOT NULL,
Waitername VARCHAR(255) NULL COMMENT '服务员的姓名',
FOREIGN KEY (Limitid) REFERENCES Characterlimit (Typeid)
);

-- 插入管理者的账号密码
INSERT INTO EveryInfo (Mytel, Password, Limitid) 
VALUES ('18888888888', '2233445566', 1);

-- 插入5位用户的信息
INSERT INTO EveryInfo (Mytel, Limitid) VALUES
('13812345678', 3),
('13912345679', 3),
('13712345680', 3),
('13612345681', 3),
('13512345682', 3);


-- 菜品类别表
CREATE TABLE Menucate(
  Cateid INT AUTO_INCREMENT PRIMARY KEY COMMENT '菜品的类别',
  Catename VARCHAR(30) COMMENT '类别的名称，最多10个汉字'
);

-- 菜品分为 主食、小吃、饮料
INSERT INTO Menucate(Catename)
VALUES 
('主食'),
('小吃'),
('饮料');

-- 菜单表
CREATE TABLE Menu(
  Foodid INT AUTO_INCREMENT PRIMARY KEY COMMENT '这道菜的编号',
  Food VARCHAR(300) NOT NULL COMMENT '这道菜的名字是Food',
  Cateid INT NULL,
  Remain INT NOT NULL COMMENT '菜品剩余量',
  Price DOUBLE NOT NULL COMMENT '单个的售价',
  FOREIGN KEY (Cateid) REFERENCES Menucate (Cateid) ON DELETE SET NULL
);

-- 这里我想打造一个西安的面馆
INSERT INTO Menu(Food, Cateid, Remain, Price)
VALUES
('油泼面', 1, 100, 18.0),
('肉夹馍', 1, 80, 9.99),
('刀削面', 1, 120, 15.0),
('五味裤带面', 1, 90, 23.88),
('陕西凉皮', 1, 110, 8.0),
('羊肉臊子面', 1, 95, 19.0),
('羊肉泡馍', 1, 85, 25.0),
('酸菜肉沫面', 1, 100, 14.99),
('红油抄手', 1, 130, 12.5),
('红烧牛肉面', 1, 100, 19.99),
('黄花菜炒蛋', 1, 80, 8.5),
('西红柿炒蛋面', 1, 110, 6.5),
('酸辣粉', 1, 120, 8.88),
('水盆羊肉', 1, 90, 29.99),
('猪肉丸', 2, 100, 5.0),
('馕儿', 2, 80, 0.99),
('青椒小炒肉', 2, 120, 18.0),
('羊肉串', 2, 110, 6.66),
('牛肉串', 2, 85, 5.0),
('牛筋面', 2, 90, 18.88),
('不安好心的油条', 2, 100, 2.0),
('蜜雪冰城柠檬水', 3, 120, 10.0),
('我没KFC热豆浆', 3, 100, 6.0),
('可口可乐', 3, 200, 3.0),
('百事雪碧', 3, 180, 3.0),
('美汁源橙汁', 3, 150, 3.0);

-- 订单状态表
CREATE TABLE Orderstatus(
  Statusid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  Statusname VARCHAR(10) NOT NULL COMMENT '仅作为id的注释'
);

-- 插入4个订单状态
INSERT INTO Orderstatus (Statusname)
VALUES 
('已支付'),
('正在制作'),
('已完成'),
('退款成功');

-- 订单关键信息
-- 这里在前端使用事务的时候出现了bug
-- Orderid不能使用自增检验
CREATE TABLE Orderform (
    Orderid INT PRIMARY KEY COMMENT '订单编号',
    Mytel CHAR(11) NULL COMMENT '下单的顾客手机号',
    Orderday DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '下单的日期和时间，精确到秒', 
    Totalprice DOUBLE NOT NULL COMMENT '总价',
    Statusid INT NOT NULL DEFAULT 1 COMMENT '订单状态',
    Score INT NULL COMMENT '订单评分',
    Visibility CHAR(1) NOT NULL DEFAULT '1' COMMENT '用户是否删除订单',
    FOREIGN KEY (Statusid) REFERENCES Orderstatus(Statusid),
    FOREIGN KEY (Mytel) REFERENCES EveryInfo(Mytel) ON DELETE SET NULL
);

-- 订单菜品详情
-- 同样不应该使用AUTO_ICREMENT
-- 但是这个主键只是摆设，不重要
CREATE TABLE OrderDetails (
    OrderDetailId INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单详情编号',
    Orderid INT NOT NULL COMMENT '订单编号',
    Foodid INT NULL COMMENT '菜品编号',
    Ordercount INT NOT NULL COMMENT '菜品数量',
    Score INT NULL COMMENT '菜品评分',
    FOREIGN KEY (Orderid) REFERENCES Orderform(Orderid) ON DELETE CASCADE,
    FOREIGN KEY (Foodid) REFERENCES Menu(Foodid) ON DELETE SET NULL
);


-- 插入 Orderform 表
INSERT INTO Orderform (Orderid, Mytel, Totalprice)
VALUES
(1, '13812345678', 105.88),
(2, '13812345678', 89.99),
(3, '13812345678', 78.88),
(4, '13812345678', 97.5),
(5, '13812345678', 120.0);

-- 插入 OrderDetails 表
INSERT INTO OrderDetails (Orderid, Foodid, Ordercount)
VALUES
(1, 1, 2),  -- 油泼面 x 2
(1, 2, 1),  -- 肉夹馍 x 1
(1, 3, 1),  -- 刀削面 x 1
(2, 1, 1),  -- 油泼面 x 1
(2, 4, 2),  -- 五味裤带面 x 2
(2, 5, 1),  -- 陕西凉皮 x 1
(3, 6, 1),  -- 羊肉臊子面 x 1
(3, 7, 1),  -- 羊肉泡馍 x 1
(3, 8, 1),  -- 酸菜肉沫面 x 1
(4, 9, 2),  -- 红油抄手 x 2
(4, 10, 1), -- 红烧牛肉面 x 1
(4, 11, 1), -- 黄花菜炒蛋 x 1
(5, 12, 1), -- 西红柿炒蛋面 x 1
(5, 13, 1), -- 酸辣粉 x 1
(5, 14, 2); -- 水盆羊肉 x 2



-- 插入 Orderform 表
INSERT INTO Orderform (Orderid, Mytel, Totalprice)
VALUES
(6, '13912345679', 98.99),
(7, '13912345679', 72.0),
(8, '13912345679', 105.0),
(9, '13912345679', 115.5),
(10, '13912345679', 85.5);

-- 插入 OrderDetails 表
INSERT INTO OrderDetails (Orderid, Foodid, Ordercount)
VALUES
(6, 1, 1),  -- 油泼面 x 1
(6, 2, 1),  -- 肉夹馍 x 1
(6, 3, 1),  -- 刀削面 x 1
(7, 4, 1),  -- 五味裤带面 x 1
(7, 5, 2),  -- 陕西凉皮 x 2
(7, 6, 1),  -- 羊肉臊子面 x 1
(8, 7, 1),  -- 羊肉泡馍 x 1
(8, 8, 1),  -- 酸菜肉沫面 x 1
(8, 9, 2),  -- 红油抄手 x 2
(9, 10, 1), -- 红烧牛肉面 x 1
(9, 11, 2), -- 黄花菜炒蛋 x 2
(9, 12, 1), -- 西红柿炒蛋面 x 1
(10, 13, 1), -- 酸辣粉 x 1
(10, 14, 2); -- 水盆羊肉 x 2


-- 插入 Orderform 表
INSERT INTO Orderform (Orderid, Mytel, Totalprice)
VALUES
(11, '13712345680', 115.5),
(12, '13712345680', 99.99),
(13, '13712345680', 85.88),
(14, '13712345680', 90.0),
(15, '13712345680', 98.0);

-- 插入 OrderDetails 表
INSERT INTO OrderDetails (Orderid, Foodid, Ordercount)
VALUES
(11, 1, 2),  -- 油泼面 x 2
(11, 2, 1),  -- 肉夹馍 x 1
(11, 3, 1),  -- 刀削面 x 1
(12, 1, 1),  -- 油泼面 x 1
(12, 4, 2),  -- 五味裤带面 x 2
(12, 5, 1),  -- 陕西凉皮 x 1
(13, 6, 1),  -- 羊肉臊子面 x 1
(13, 7, 1),  -- 羊肉泡馍 x 1
(13, 8, 2),  -- 酸菜肉沫面 x 2
(14, 9, 2),  -- 红油抄手 x 2
(14, 10, 1), -- 红烧牛肉面 x 1
(14, 11, 1), -- 黄花菜炒蛋 x 1
(15, 12, 1), -- 西红柿炒蛋面 x 1
(15, 13, 1), -- 酸辣粉 x 1
(15, 14, 2); -- 水盆羊肉 x 2


-- 插入 Orderform 表
INSERT INTO Orderform (Orderid, Mytel, Totalprice)
VALUES
(16, '13612345681', 110.0),
(17, '13612345681', 92.99),
(18, '13612345681', 87.5),
(19, '13612345681', 108.0),
(20, '13612345681', 98.88);

-- 插入 OrderDetails 表
INSERT INTO OrderDetails (Orderid, Foodid, Ordercount)
VALUES
(16, 1, 1),  -- 油泼面 x 1
(16, 2, 2),  -- 肉夹馍 x 2
(16, 3, 1),  -- 刀削面 x 1
(17, 4, 1),  -- 五味裤带面 x 1
(17, 5, 2),  -- 陕西凉皮 x 2
(17, 6, 1),  -- 羊肉臊子面 x 1
(18, 7, 1),  -- 羊肉泡馍 x 1
(18, 8, 1),  -- 酸菜肉沫面 x 1
(18, 9, 1),  -- 红油抄手 x 1
(19, 10, 2), -- 红烧牛肉面 x 2
(19, 11, 1), -- 黄花菜炒蛋 x 1
(19, 12, 1), -- 西红柿炒蛋面 x 1
(20, 13, 1), -- 酸辣粉 x 1
(20, 14, 1); -- 水盆羊肉 x 1


-- 插入 Orderform 表
INSERT INTO Orderform (Orderid, Mytel, Totalprice)
VALUES
(21, '13512345682', 123.5),
(22, '13512345682', 110.0),
(23, '13512345682', 95.0),
(24, '13512345682', 101.99),
(25, '13512345682', 99.99);

-- 插入 OrderDetails 表
INSERT INTO OrderDetails (Orderid, Foodid, Ordercount)
VALUES
(21, 1, 1),  -- 油泼面 x 1
(21, 2, 2),  -- 肉夹馍 x 2
(21, 3, 1),  -- 刀削面 x 1
(22, 4, 1),  -- 五味裤带面 x 1
(22, 5, 2),  -- 陕西凉皮 x 2
(22, 6, 1),  -- 羊肉臊子面 x 1
(23, 7, 1),  -- 羊肉泡馍 x 1
(23, 8, 1),  -- 酸菜肉沫面 x 1
(23, 9, 1),  -- 红油抄手 x 1
(24, 10, 2), -- 红烧牛肉面 x 2
(24, 11, 1), -- 黄花菜炒蛋 x 1
(24, 12, 1), -- 西红柿炒蛋面 x 1
(25, 13, 1), -- 酸辣粉 x 1
(25, 14, 1); -- 水盆羊肉 x 1

-- 更新订单1
UPDATE Orderform SET Orderday = '2019-03-15 14:23:12' WHERE Orderid = 1;
-- 更新订单2
UPDATE Orderform SET Orderday = '2020-05-25 09:17:45' WHERE Orderid = 2;
-- 更新订单3
UPDATE Orderform SET Orderday = '2021-07-30 16:45:33' WHERE Orderid = 3;
-- 更新订单4
UPDATE Orderform SET Orderday = '2022-11-11 10:34:50' WHERE Orderid = 4;
-- 更新订单5
UPDATE Orderform SET Orderday = '2023-09-09 20:21:37' WHERE Orderid = 5;
-- 更新订单6
UPDATE Orderform SET Orderday = '2020-01-12 08:11:28' WHERE Orderid = 6;
-- 更新订单7
UPDATE Orderform SET Orderday = '2021-06-03 13:55:12' WHERE Orderid = 7;
-- 更新订单8
UPDATE Orderform SET Orderday = '2022-02-18 11:42:56' WHERE Orderid = 8;
-- 更新订单9
UPDATE Orderform SET Orderday = '2023-12-05 07:28:03' WHERE Orderid = 9;
-- 更新订单10
UPDATE Orderform SET Orderday = '2019-08-25 15:16:27' WHERE Orderid = 10;
-- 更新订单11
UPDATE Orderform SET Orderday = '2020-06-22 12:53:09' WHERE Orderid = 11;
-- 更新订单12
UPDATE Orderform SET Orderday = '2021-09-09 17:40:51' WHERE Orderid = 12;
-- 更新订单13
UPDATE Orderform SET Orderday = '2022-04-04 19:06:33' WHERE Orderid = 13;
-- 更新订单14
UPDATE Orderform SET Orderday = '2023-10-27 06:51:24' WHERE Orderid = 14;
-- 更新订单15
UPDATE Orderform SET Orderday = '2019-02-14 04:25:06' WHERE Orderid = 15;
-- 更新订单16
UPDATE Orderform SET Orderday = '2020-04-30 18:39:42' WHERE Orderid = 16;
-- 更新订单17
UPDATE Orderform SET Orderday = '2021-12-12 02:04:35' WHERE Orderid = 17;
-- 更新订单18
UPDATE Orderform SET Orderday = '2022-01-20 21:16:18' WHERE Orderid = 18;
-- 更新订单19
UPDATE Orderform SET Orderday = '2023-07-25 23:39:56' WHERE Orderid = 19;
-- 更新订单20
UPDATE Orderform SET Orderday = '2024-01-05 05:29:42' WHERE Orderid = 20;
-- 更新订单21
UPDATE Orderform SET Orderday = '2020-03-16 22:07:55' WHERE Orderid = 21;
-- 更新订单22
UPDATE Orderform SET Orderday = '2021-11-04 01:53:33' WHERE Orderid = 22;
-- 更新订单23
UPDATE Orderform SET Orderday = '2022-08-12 14:48:49' WHERE Orderid = 23;
-- 更新订单24
UPDATE Orderform SET Orderday = '2023-06-18 10:30:24' WHERE Orderid = 24;
-- 更新订单25
UPDATE Orderform SET Orderday = '2024-02-08 17:15:58' WHERE Orderid = 25;

