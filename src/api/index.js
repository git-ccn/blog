import requset from "../utils/request";
import axios from 'axios'


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

// 获取用户职位信息
export const postsInfoApi = () => {
  return requset.get('/api/postsInfo')
}

// 修改职位
export const postsChangeApi = (body) => {
  return requset.post('/main/posts', body)
}

// 上传图片
export const uploadApi = (body) => {
  return axios({
    url: '/api',
    method: 'post',
    processData: false,
    mimeType: 'multipart/form-data',
    contentType: false,
    data: body
  })
}