import {
  createBrowserRouter
} from 'react-router-dom'
import Madman from '../views/Madman'
import Highman from '../views/Highman'
import Home from '../Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  }, {
    path: '/madman',
    element: <Madman />
  }, {
    path: '/highman',
    element: <Highman />
  }
])

export default router