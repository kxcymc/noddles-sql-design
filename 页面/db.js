import dotenv from 'dotenv'
dotenv.config()
import { createPool } from 'mysql2'

// 创建连接池
const pool = createPool({
    host: process.env.DB_HOST,    
    user: process.env.DB_USER,    
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME 
})
console.log('DB configuration:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
// 获取连接
export default pool.promise()
// export default pool