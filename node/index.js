const express = require('express')
const app = express()
const cors = require('cors')
const { expressjwt } = require('express-jwt')
const session = require('express-session')
const http = require('http')
const server = http.createServer(app);


const { User, UserInfo } = require('./route')
const webSocketChat = require('./routeHandle/webSocketChat')

// 解决跨域问题
app.use(cors())

// 传参问题
app.use(express.json())

// 配置session
app.use(session({
  secret: '_token',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}))

// 返回模板
app.use((req, res, next) => {
  res.sendValue = ({ code = 0, data = null, msg }) => {
    res.send({
      code,
      data,
      message: msg
    })
  }
  next()
})

// 解析token
const secretKey = 'ccn'
app.use(expressjwt({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

app.use('/api', User())
app.use('/main', UserInfo())

// 全局错误
app.use((error, req, res, next) => {
  if (error.code = 'invalid_token') {
    res.sendValue({ code: 401, msg: 'token过期' })
  }
})

server.listen(5053, () => {
  console.log('http://localhost:5053', '链接成功');
})

webSocketChat(server)
