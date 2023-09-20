import requset from "../utils/request";

// 登录
export const loginApi = (data) => {
  return requset.post('/api/login', data)
}

// 获取所有用户信息
export const userInfoApi = () => {
  return requset.get('/api/userInfo')
}

// 修改用户名称
export const userNameApi = (body) => {
  return requset.post('/main/username', body)
}