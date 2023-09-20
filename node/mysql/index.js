const mysql = require('mysql')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cn200028',
  database: 'toachfish'
})

db.connect((err) => {
  if (err) {
    console.error('无法链接数据库', err);
    return
  }
})

module.exports = db