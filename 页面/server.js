import express, { json } from 'express'
import db from './db.js'  // 导入数据库连接模块
import cors from 'cors'
const app = express()

// 使用 CORS 中间件来允许跨域请求
app.use(cors({
    // origin: "http://localhost:8080",
    origin: `http://localhost:${process.env.PORT || 8080}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// 中间件
app.use(json())  // 解析 JSON 格式的请求体

app.get('/', (req, res) => {
    res.send('欢迎使用我们的后端 API！')
})

// 接口:检查是否存在指定用户的信息
app.post('/checkUsertel', async (req, res) => {
    const { Mytel } = req.body

    if (!Mytel) {
        return res.status(400).json({ success: false, message: 'Mytel 参数缺失' })
    }

    // 查询数据库是否存在该用户
    const query = 'SELECT Mytel FROM EveryInfo WHERE Mytel = ?'
    try {
        const [results] = await db.execute(query, [Mytel])

        if (results.length > 0 && results[0].Mytel === Mytel) {
            res.status(200).json({ message: "找到了该用户！", result: true })
        } else {
            res.status(201).json({ message: "用户不存在啊", result: false })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: '服务器内部错误' })
    }
})


// 接口: 创建新用户，如用户已存在，直接登录，不存储信息
app.post('/api/saveUsertel', async (req, res) => {
    const { Mytel, Limitid } = req.body
    try {
        const [result1] = await db.execute('SELECT Limitid FROM EveryInfo WHERE Mytel = ?', [Mytel])
        if (result1.length <= 0) {
            const [result2] = await db.execute('INSERT INTO EveryInfo (Mytel, Limitid) VALUES (?, ?)', [Mytel, Limitid])
            if (result2.affectedRows > 0) {
                res.status(200).json({ message: '登录成功' })
            } else {
                res.status(201).json({ message: '登录失败，请稍后再试' })
            }
        } else {
            if(result1[0].Limitid === 3){
                res.status(200).json({ message: '登录成功' })
            } else {
                res.status(201).json({ message: '服务员或老板不能登录' })
            }
        }
        
    } catch (err) {
        console.dir(err)
        res.status(500).json({ message: '数据库错误' })
    }
})

// 接口: 获取菜单
app.post('/api/getFoodMenu', async (req, res) => {
    const query = 'SELECT * FROM Menu'
    try {
        // 执行查询操作
        const [results] = await db.execute(query)
        // 返回查询结果
        res.status(200).json(results)
    } catch (err) {
        // 处理查询错误
        res.status(500).send('查询菜单出现错误')
    }
})


// 接口: 获取最后一个订单编号
app.post('/api/getLastOrderID', async (req, res) => {
    try {
        const query = 'SELECT MAX(Orderid) AS lastOrderID FROM Orderform'
        const [result] = await db.execute(query)

        // 检查结果是否有数据
        if (result && result.length > 0) {
            res.status(200).json({
                message: '取回最后一个订单编号了',
                lastOrderID: result[0].lastOrderID
            })
        } else {
            res.status(201).json({
                message: '数据表不存在'
            })
        }
    } catch (err) {
        console.dir(err)
        res.status(500).json({
            message: '数据库错误',
            error: err.message || '未知错误'
        })
    }
})


// 接口: 存储订单信息, 更新菜品剩余量
// 使用事务(transaction)来完成，避免数据不一致
app.post('/api/saveOrderInfo', async (req, res) => {
    const { orderList } = req.body
    const { Orderid, Mytel, Statusid, Totalprice } = orderList[0]

    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        // 插入Orderform
        const orderformQuery = 'INSERT INTO Orderform (Orderid, Mytel, Totalprice, Statusid) VALUES (?, ?, ?, ?)'
        const [result1] = await connection.execute(orderformQuery, [Orderid, Mytel, Totalprice, Statusid])

        // 插入OrderDetails和更新Menu
        for (const food of orderList.slice(1)) {
            const { Foodid, count, remainNumber } = food

            const insertedOrderId = result1.insertId
            console.log(insertedOrderId, Orderid)
            // 插入Orderdetails
            const orderdetailsQuery = 'INSERT INTO OrderDetails (Orderid, Foodid, Ordercount) VALUES (?, ?, ?)'
            const [result2] = await connection.execute(orderdetailsQuery, [Orderid, Foodid, count])

            // 更新 Menu 的剩余量
            const menuQuery = 'UPDATE Menu SET Remain = ? WHERE Foodid = ?'
            const [result3] = await connection.execute(menuQuery, [remainNumber, Foodid])

            // 如果其中任一操作失败，可以抛出异常触发回滚
            if (!result2.affectedRows || !result3.affectedRows) {
                throw new Error('OrderDetails 插入或 Menu 更新失败')
            }
        }

        await connection.commit()
        res.status(200).json({ message: '下单成功啦！在这里查看～', orderList: orderList })
    } catch (err) {
        await connection.rollback()
        console.dir(err)
        connection.release()
        res.status(500).json({ message: '插入订单信息和更新菜单失败', })
    }
})


// 接口: 取回无用户名的顾客们，最新下单的数据
// [
//     {
//         Orderid:1,
//         Ordertime:'1',
//         Totalprice:1,
//         Statusid:1,
//     },
//     {
//         Foodid:1,
//         Foodcount:1,
//     },
// ]
app.post('/api/fetchlastOrderwithNULL', async (req, res) => {
    try {
        const query1 = 'SELECT Orderid, Orderday AS Ordertime, Totalprice, Statusid FROM Orderform WHERE Mytel IS NULL ORDER BY Orderday DESC LIMIT 1'
        const [result1] = await db.execute(query1)
        const query2 = 'SELECT Foodid, Ordercount FROM OrderDetails WHERE Orderid = ?'
        const [result2] = await db.execute(query2, [result1[0].Orderid])
        res.status(200).json({ message: '取回最新订单了', lastOrder: [result1[0], ...result2] })
    } catch (err) {
        console.dir(err)
        res.status(500).json({ message: '无法获取最新订单', })
    }
})


// 接口: 返回指定 顾客 的全部可见订单，按 最新下单时间 降序排列
app.post('/api/fecthOrderWithUsername', async (req, res) => {
    // [
    //     [
    //         {
    //             Orderid:1,
    //             Ordertime:'2',
    //             Totalprice:1,
    //             Statusid:1,
    //         },
    //         {
    //             Foodid:1,
    //             Foodcount:1,
    //         },
    //     ],
    //     [
    //         {
    //             Orderid:1,
    //             Ordertime:'1',
    //             Totalprice:1,
    //             Statusid:1,
    //         },
    //         {
    //             Foodid:1,
    //             Foodcount:1,
    //         },
    //     ],
    // ]
    const { Mytel } = req.body
    try {
        const query1 = "SELECT Orderid, Orderday AS Ordertime, Totalprice, Statusid FROM Orderform WHERE Mytel = ? AND Visibility = '1' ORDER BY Orderday DESC"
        const [result1] = await db.execute(query1, [Mytel])
        const query2 = "SELECT od.Foodid, od.Ordercount FROM OrderDetails od JOIN Orderform orf ON od.Orderid = orf.Orderid WHERE orf.Visibility = '1' AND orf.Orderid = ?"
        const totalOrder = await Promise.all(result1.map(async item => {
            const [result2] = await db.execute(query2, [item.Orderid])
            return [item, ...result2]
        }))
        res.status(200).json({ message: '取回最新订单了', totalOrder: totalOrder })
    } catch (err) {
        console.dir(err)
        res.status(500).json({ message: '无法获取最新订单', })
    }
})

// 接口: 用户请求对某一个订单退款，修改订单状态
app.post('/api/userRefundOneOrder', async (req, res) => {
    try {
        const { Orderid } = req.body
        const query = 'UPDATE Orderform SET Statusid = 4 WHERE Orderid = ?'
        const [result] = await db.execute(query, [Orderid])
        if (result.affectedRows) {
            res.status(200).json({ message: '退款成功！' })
        } else {
            throw new Error('出现错误，无法修改订单状态！')
        }
    } catch (error) {
        console.dir(error)
        res.status(500).json({ message: '请联系店员！数据库更新错误' })
    }
})

// 接口: 用户想删除某一个订单，修改其 Visibility 为 '0'
app.post('/api/userUnvisitOneOrder', async (req, res) => {
    try {
        const { Orderid } = req.body
        const query = "UPDATE Orderform SET Visibility = '0' WHERE Orderid = ?"
        const [result] = await db.execute(query, [Orderid])
        if (result.affectedRows) {
            res.status(200).json({ message: '删除订单成功！' })
        } else {
            throw new Error('出现错误，无法修改可见状态！')
        }
    } catch (error) {
        console.dir(error)
        res.status(500).json({ message: '请联系店员！数据库更新错误' })
    }
})

// 接口: 服务员注册事件，插入新数据
app.post('/api/waiterRegister', async (req, res) => {
    try {
        const { Waitername, Mytel, Password } = req.body
        const query = "INSERT INTO EveryInfo (Mytel, Password, Limitid, Waitername) VALUES (?, ?, ?, ?)"
        const [result] = await db.execute(query, [Mytel, Password, 2, Waitername])
        if (result.affectedRows > 0) {
            res.status(200).json({ message: '注册成功，返回登录框吧！' })
        } else {
            res.status(201).json({ message: '注册失败，可能需要联系老板' })
        }
    } catch (error) {
        console.dir(err)
        res.status(500).json({
            message: '数据库错误',
            error: err.message || '未知错误'
        })
    }
})

// 接口: 服务员/管理者 登录，检查密码是否正确，需要返回角色权限id 2/1
app.post('/api/waiterLogin', async (req, res) => {
    const { Mytel, Password } = req.body
    try {
        const query = 'SELECT Mytel, Limitid, Waitername FROM EveryInfo WHERE Mytel = ? AND Password = ? AND Limitid != 3'
        const [result] = await db.execute(query, [Mytel, Password])
        // 检查结果是否有数据
        if (result && result.length > 0) {
            res.status(200).json({
                message: '登录成功！',
                topBarData: result[0]
            })
        } else {
            res.status(201).json({
                message: '手机号或密码错误'
            })
        }
    } catch (err) {
        console.dir(err)
        res.status(500).json({
            message: '数据库错误',
            error: err.message || '未知错误'
        })
    }
})

// 接口: 服务员 修改密码
app.post('/api/waiterChangePassword', async (req, res) => {
    const { Mytel, Password } = req.body
    try {
        const query1 = 'SELECT Password FROM EveryInfo WHERE Mytel = ?'
        const [res1] = await db.execute(query1, [Mytel])
        console.dir(res1)
        if (res1[0].Password === Password) {
            res.status(201).json({ message: '新密码不能与旧密码相同！' })
        } else {
            const query2 = "UPDATE EveryInfo SET Password = ? WHERE Mytel = ?"
            const [result] = await db.execute(query2, [Password, Mytel])
            if (result.affectedRows > 0) {
                res.status(200).json({ message: '成功修改密码！' })
            } else {
                res.status(201).json({ message: '修改失败，请稍后再试' })
            }
        }
    } catch (err) {
        console.dir(err)
        res.status(500).json({
            message: '数据库错误',
            error: err.message || '未知错误'
        })
    }
})

// 接口: 注销 服务员账号
app.post('/api/deleteWaiter', async (req, res) => {
    const { Mytel } = req.body
    try {
        const query1 = 'SELECT Limitid FROM EveryInfo WHERE Mytel = ?'
        const [res1] = await db.execute(query1, [Mytel])
        console.dir(res1)
        if (res1[0].Limitid !== 2) {
            res.status(201).json({ message: '您输入的用户名不是服务员！' })
        } else {
            const query2 = "DELETE FROM EveryInfo WHERE Mytel = ?"
            const [result] = await db.execute(query2, [Mytel])
            if (result.affectedRows > 0) {
                res.status(200).json({ message: '成功删除服务员信息！' })
            } else {
                res.status(201).json({ message: '删除失败，请检查用户名' })
            }
        }
    } catch (err) {
        console.dir(err)
        res.status(500).json({
            message: '数据库错误',
            error: err.message || '未知错误'
        })
    }
})

// 接口: 修改 指定一个订单编号 的 订单状态
app.post('/api/changeOneOrderStatus', async (req, res) => {
    const { Orderid, Statusname } = req.body
    try {
        const query1 = 'SELECT * FROM Orderform WHERE Orderid = ?'
        const [res1] = await db.execute(query1, [Orderid])
        console.dir(res1)
        if (res1.length <= 0) {
            res.status(201).json({ message: '订单编号不存在，或已被删除，或未累计至该编号。' })
        } else {
            const query2 = "UPDATE Orderform o JOIN Orderstatus s ON o.Statusid = s.Statusid SET o.Statusid = (SELECT Statusid FROM Orderstatus WHERE Statusname = ?) WHERE o.Orderid = ?"
            const [result] = await db.execute(query2, [Statusname, Orderid])
            if (result.affectedRows > 0) {
                res.status(200).json({ message: '成功修改订单 的订单状态为' })
            } else {
                res.status(201).json({ message: '修改失败,请稍后再试' })
            }
        }
    } catch (err) {
        console.dir(err)
        res.status(500).json({
            message: '数据库错误',
            error: err.message || '未知错误'
        })
    }
})


// 启动服务
const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})

// 监听退出信号并关闭数据库连接池
process.on('SIGINT', async () => {
    console.log('正在关闭连接池...')
    await db.end()
    server.close(() => {
        console.log('服务器已关闭.')
        process.exit(0)
    })
})