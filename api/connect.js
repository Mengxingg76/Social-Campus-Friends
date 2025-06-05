// mysql
import mysql from "mysql"

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"social"
})

// // mssql
// import sql from "mssql";

// // SQL Server 连接配置（无密码账户版）
// export const config = {
//   server: "localhost\\SQLEXPRESS",
//   database: "social",
//   user: "simple_user",      // 使用刚创建的用户名
//   password: "1234",         // 密码
//   options: {
//     encrypt: false,         // 本地开发可禁用加密
//     trustServerCertificate: true,
//     connectionTimeout: 30000
//   }
// };

// // 创建连接池
// export const db = new sql.ConnectionPool(config)
//   .connect()
//   .then(pool => {
//     console.log("✅ 成功连接到 SQL Server");
//     return pool;
//   })
//   .catch(err => {
//     console.error("❌ 连接 SQL Server 失败:", err);
//     process.exit(1); // 退出进程
//   });
