const express = require('express')
const router = express.Router()
const { login, userInfo, userPots, userUsername, diedBook, postsInfo, uploadheardImg } = require('../routeHandle/userInfo')

// 用户登录
const User = () => {
  router.post('/login', login)
  router.get('/userInfo', userInfo)
  router.get('/postsInfo', postsInfo)
  return router
}

const UserInfo = () => {
  router.post('/posts', userPots)
  router.post('/username', userUsername)
  return router
}

module.exports = {
  User,
  UserInfo
}