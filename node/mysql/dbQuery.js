const db = require("./index")
const { sqlErrorCode } = require("./sql")

const dbQuery = (sql, body, res, callback) => {
  db.query(sql, body, (err, result) => {
    if (err && !sqlErrorCode.includes(err.code)) return res.sendValue({ msg: err })
    callback(err, result)
  })
}

module.exports = dbQuery