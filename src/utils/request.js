import { message } from "antd";
import { Axioswrap } from "jscommpont";
import { User } from "./tools";
const requset = Axioswrap({
  baseURL: 'http://localhost:5053',
  codeMessage: {
    code: 401,
    type: 'notips',
    MessageToken: () => {
      message.info('请先登录')
      setTimeout(() => {
        User.removeLocal()
        // location.reload()
      }, 1000);
    }
  },
  token: User.getToken(),
  errMessage: (msg) => {
    message.error(msg)
  },
  resErrorMessage: [
    {
      code: 500,
      messageInfo: (msg) => {
        message.error(msg)
      }
    }
  ]
})

export default requset