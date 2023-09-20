import React from 'react';
import Stylecss from './madman.module.css';
import { useState, useEffect } from 'react';
import { TextLoop } from "react-text-loop-next";
import { useNavigate } from 'react-router-dom';
import Card from '../../commponts/Card';
import { ChatCard, crazy } from './config';
import { Button, Space, Input, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { Form } from 'antd';
import { RegulaRexpression } from 'jscommpont'
import { loginApi, userInfoApi, userNameApi } from '../../api';
import { User } from '../../utils/tools';
import { message } from 'antd';
import { Popover } from 'antd';
import { useRef } from 'react';


const Madman = () => {

  const history = useNavigate()
  const [time, Settime] = useState()
  const [isModalOpen, SetisModalOpen] = useState(false)
  const [userInfo, SetuserInfo] = useState(User.getLocal() || [])
  const [form] = Form.useForm();
  const [people, Setpeople] = useState([])
  const [usernameFlag, SetusernameFlag] = useState(false)
  const [message, Setmessage] = useState('')
  const [chat, Setchat] = useState([])
  const socket = useRef()
  const [person, Setperson] = useState(0)
  const chatContainerRef = useRef(null)

  // 时间
  const Time = () => {
    setInterval(() => {
      const dataTime = new Date().toLocaleString('en-US',
        {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hourCycle: 'h24'
        })
      Settime(dataTime)
    }, 1000)
  }

  // 退出
  const exit = () => {
    history('/')
  }

  const test = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 1,], [3, 4, 5, 1, 2], [4, 5, 1, 2, 3], [5, 1, 2, 3, 4]]

  // 公告栏
  const Notice = Array.from({ length: 5 }, (_, index) =>
  (<li key={index}><TextLoop children={test[index]}>
  </TextLoop></li>)
  )

  // 用户聊天样式
  const userChat = () => {
    const chatDom = chat.map((item, key) =>
      <div key={key} className={Stylecss.user}>
        <span>{item.username}</span>
        <div className={Stylecss.chatContent}>
          {item.message}
        </div>
      </div>
    )
    return <div ref={chatContainerRef} className={Stylecss.userContent}>{chatDom}</div>
  }

  // 人员榜样式
  const user = () => {
    const userDom = people.slice(0, 5).map((item) =>
      <div key={item.userid} className={Stylecss.userinfoAll}>
        <Avatar icon={<UserOutlined />}></Avatar>
        <div className={Stylecss.name}>{item.username}</div>
        <div className={Stylecss.position}>{item.posts}</div>
      </div>
    )
    return <div className={Stylecss.userinfoContent}>{userDom}</div>
  }

  // 生死簿人员
  const diedUser = () => {
    const userDom = people.map((item) =>
      <div key={item.userid} className={Stylecss.userinfoAll}>
        <Avatar icon={<UserOutlined />}></Avatar>
        <div className={Stylecss.name}>{item.username}</div>
        <div className={Stylecss.life}>{item.life}年</div>
        <div className={Stylecss.position}>{item.posts}</div>
      </div>
    )
    return <div className={Stylecss.diedPerson}>{userDom}</div>
  }

  const userHandle = () => {
    if (!userInfo.length) {
      SetisModalOpen(true)
    } else {
    }
  }

  // 修改用户名称
  const usernameHandle = () => {
    if (User.getLocal()) {
      SetusernameFlag(true)
      SetisModalOpen(true)
    }
  }

  // 登录/注册
  const login = async () => {
    await form.validateFields()
    let param = form.getFieldsValue()
    let userinfo
    if (!usernameFlag) {
      const { data: res } = await loginApi(param)
      const { data } = res
      userinfo = data
    } else {
      param = {
        ...param,
        userid: userInfo[0].userid
      }
      await userNameApi(param)
      userinfo = [{
        ...User.getLocal()[0],
        username: param.username
      }]
    }
    User.setLocal(userinfo)
    SetuserInfo(userinfo)
    clear()
    userInfoAll()
    !usernameFlag && location.reload()
  }

  // 获取所有用户信息
  const userInfoAll = async () => {
    const { data: res } = await userInfoApi()
    const { data } = res
    Setpeople(data)
  }

  // 退出登录
  const logout = () => {
    User.removeLocal()
    location.reload()
  }

  // 退出登录表
  const clear = () => {
    form.resetFields()
    SetisModalOpen(false)
  }

  // 邮箱正则表达式
  const validateUsername = (_, value) => {
    if (!value) {
      return Promise.reject('请输入邮箱')
    }
    if (!RegulaRexpression(value).eMail()) {
      return Promise.reject('请输入正确的邮箱');
    }
    return Promise.resolve();
  };

  // 输入内容
  const change = (e) => {
    Setmessage(e.target.value)
  };

  // 发送消息
  const submit = () => {
    if (!message.length) return
    const msg = {
      ...userInfo[0],
      message
    }
    const msgData = JSON.stringify(msg)
    socket.current.send(msgData)
    Setmessage('')
  }

  // 聊天框
  useEffect(() => {
    const sockets = new WebSocket("ws://localhost:5053")
    socket.current = sockets
    sockets.addEventListener('open', () => {
      console.log('WebSocket连接已建立');
    });

    sockets.addEventListener('message', (event) => {
      const message = event.data;
      const fileReader = new FileReader()
      fileReader.readAsText(message, 'utf-8')
      fileReader.onload = () => {
        const result = JSON.parse(fileReader.result)
        Setperson(result.person)
        Setchat(result.historyChat)
        chatContainerRef.current.scrollTop = 10000;

      }
    });

    sockets.addEventListener('close', () => {
      console.log('WebSocket连接已关闭');
    });
  }, [])

  useEffect(() => {
    Time()
    userInfoAll()
  }, [])

  return (
    <div className={Stylecss.content}>

      <div className={Stylecss.heard}>
        <div className={Stylecss.time}>{time}</div>
        <ul className={Stylecss.notice}>
          {Notice}
        </ul>
      </div>

      <div className={Stylecss.contaior}>
        <div className={Stylecss.left}>
          <h2>左厅</h2>
        </div>
        <div className={Stylecss.middle}>
          <h2>大殿</h2>
          <div className={Stylecss.main}>
            <Card id={Stylecss.crazyPool} {...crazy}>
              <h3>人员榜</h3>
              {user()}
            </Card>
            {/* 汇报板 */}
            <Card id={Stylecss.chat} {...ChatCard} >
              <h3>汇报板</h3>
              {userChat()}
              <div className={Stylecss.foot}>
                <Space.Compact
                  style={{
                    width: '100%',
                  }}
                >
                  <Input placeholder='输入' value={message} onChange={change} />
                  <Button onClick={submit} type="primary" danger>发送</Button>
                </Space.Compact>
              </div>
              <span className={Stylecss.people}>人数：{person}</span>
            </Card>
            <Card />
          </div>
        </div>
        <div className={Stylecss.right}>
          <h2>右堂</h2>
        </div>
      </div>

      {/* 退出 */}
      <div onClick={exit} className={Stylecss.exit}>
        <img src="src\assets\image\exit.png" alt="" />
      </div>

      {/* 用户栏 */}
      <div className={Stylecss.userInfo}>
        <div className={Stylecss.avatar}>
          <Avatar onClick={userHandle}
            icon={userInfo.length && <UserOutlined />} >{!userInfo.length && '登录'}</Avatar>
          <div onClick={usernameHandle} className={Stylecss.name}>{!userInfo.length ? '虚无' : userInfo[0].username}</div>
        </div>
        <br />
        <Popover placement="left" content={diedUser()} trigger="click">
          <div className={Stylecss.diedBook}>
            <img src="src\assets\image\book.svg" alt="" />
            <div className={Stylecss.name}>生死簿</div>
          </div>
        </Popover>
        <br />
        <div className={Stylecss.setting}>
          <img src="src\assets\image\setting-filling.svg" alt="" />
          <div className={Stylecss.name}>设置</div>
        </div>
      </div>

      {/* 登录注册 */}
      <Modal title={usernameFlag ? '修改名称' : "登录/注册"}
        open={isModalOpen}
        onOk={login}
        onCancel={clear}>
        <div className={Stylecss.loginContent}>
          {!usernameFlag && <h2>欢迎来到地府&#128520;，留下你的邮箱便于我们找到你</h2>}
          <Form
            name="basic"
            form={form}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              username: userInfo[0]?.username
            }}
            autoComplete="off"
          >
            {!usernameFlag && <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  required: true, validator: validateUsername
                }
              ]}
            >
              <Input />
            </Form.Item>}

            {!usernameFlag && <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入你的密码',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>}

            {usernameFlag && <Form.Item
              label="用户名"
              name="username"
            >
              <Input />
            </Form.Item>}
            {
              usernameFlag && <Button
                style={{
                  marginLeft: '50%',
                  transform: 'translateX(-50%)',
                  width: '-webkit-fill-available'
                }}
                onClick={logout} type="primary" danger>退出登录</Button>
            }
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default Madman