// localStroage存/取用户信息
export const User = {
  setLocal: (userinfo) => localStorage.setItem('userInfo', JSON.stringify(userinfo)),
  getLocal: () => JSON.parse(localStorage.getItem('userInfo')),
  getToken: () => {
    if (User.getLocal()) {
      return 'Bearer ' + User.getLocal()[0].token
    } else {
      return null
    }
  },
  removeLocal: () => localStorage.removeItem('userInfo')
}