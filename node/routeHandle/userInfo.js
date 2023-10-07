const db = require('../mysql')
const dbQuery = require('../mysql/dbQuery')
const sql = require('../mysql/sql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')

// 生成令牌
const secretKey = 'ccn'
const options = { expiresIn: '1h' }
// 密码加密，哈希轮数
const saltRounds = 10


// 登录
const login = (req, res) => {
  const body = Object.values(req.body)
  dbQuery(sql.selectContions('user', ['email']), [body[0]], res, (err, results) => {
    if (results.length === 0) {
      const hashedPassword = bcrypt.hashSync(body[1], saltRounds)
      body[1] = hashedPassword
      dbQuery(sql.insetOnce('user', ['email', 'password']), body, res, (err, result) => {
        login(req, res)
      })
    } else {
      dbQuery(sql.selectJoin(['user', 'posts'], [], 'left', 'a.posts = b.name'), [], res, (err, result) => {
        result = [result.find(item => item.email === results[0].email)]
        const isPasswordValid = bcrypt.compareSync(body[1], result[0].password);
        if (!isPasswordValid) return res.sendValue({ code: 500, msg: '密码错误' })
        const payload = { ...body, password: '', username: '杂役' }
        const token = jwt.sign(payload, secretKey, options)
        result = result.map(item => {
          const { password, create_time, ...res } = item
          return { ...res, token: token }
        })
        res.sendValue({ data: result, msg: '登录成功' })
      })
    }
  })
}

// 获取用户信息
const userInfo = (req, res) => {
  dbQuery(sql.selectJoin(['user', 'posts'], [], 'left', 'a.posts = b.name'), [], res, (err, result) => {
    result = result.map(item => {
      const { password, token, ...res } = item
      return res
    })
    res.sendValue({ data: result, msg: '成功' })
  })
}

// 获取职位信息
const postsInfo = (req, res) => {
  dbQuery(sql.selectAll('posts'), [], res, (err, result) => {
    res.sendValue({ data: result, msg: '成功' })
  })
}

// 修改用户职位
const userPots = (req, res) => {
  const body = Object.values(req.body)
  dbQuery(sql.selectJoin(['user', 'posts'], ['a.*', 'b.num', 'b.id'], 'left', 'a.posts = b.name', 'b.id'), [body[0].value], res, (err, results) => {
    if (results.length > results[0]?.num) return res.sendValue({ code: 500, msg: '职位已满，请申请职位挑战' })
    dbQuery(sql.update('user', ['posts'], ['userid']), [body[0].label, body[1]], res, (err, result) => {
      res.sendValue({ msg: '升职成功' })
    })
  })
}

// 修改用名称
const userUsername = (req, res) => {
  const body = Object.values(req.body)
  dbQuery(sql.update('user', ['username'], ['userid']), body, res, (err, result) => {
    res.sendValue({ msg: '修改成功' })
  })
}

module.exports = {
  login,
  userInfo,
  userPots,
  userUsername,
  postsInfo,
}