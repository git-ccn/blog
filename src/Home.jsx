import React from 'react'
import Stylecss from './Home.module.css'
import { useNavigate } from 'react-router-dom'

const ThreeDoor = [{
  name: '地狱池',
  className: {
    h2: Stylecss.fire,
    back: Stylecss.backFire
  },
  door: '1'
}, {
  name: '天堂地',
  className: {
    h2: Stylecss.highman,
    back: Stylecss.backHigh
  },
  door: '1'
}, {
  name: '社畜群',
  className: {
    h2: Stylecss.compontman,
    back: Stylecss.backComp
  },
  door: '1'
}]

const Home = () => {
  // 路由
  const histoty = useNavigate()

  // 开门进入
  const inDoor = (e) => {
    const route = ['/madman', '/highman']
    const element = e.currentTarget
    const door = element.children[0]
    const key = door.getAttribute('id')
    door.classList.add(Stylecss.openActive)
    setTimeout(() => {
      histoty(route[Number(key)])
    }, 1000);
  }


  // 页面
  const HomeView = ThreeDoor.map((item, key) =>
    <div key={key} className={`${Stylecss.Contentdoor} ${item.className.back}`}>
      <h2 className={item.className.h2}>{item.name}</h2>
      <div
        onClick={inDoor}
        style={{
          position: 'absolute',
          bottom: '0'
        }}>
        <div id={key} className={Stylecss.door}></div>
        <div className={Stylecss.doorOpen}></div>
      </div>
    </div>)

  return (
    <div className={Stylecss.content}>
      {HomeView}
    </div>
  )
}

export default Home