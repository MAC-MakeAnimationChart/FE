import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import MainPage from './pages/MainPage'
import Mypage from './pages/Mypage'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={< MainPage />} >
          {/* <Route index element={ } />
          <Route action='' element={ } /> */}
        </Route>
        <Route path='/main' element={<Login />} />
        <Route path='/mypage' element={<Mypage />} />
      </Routes>
    </>
  )
}

export default App
