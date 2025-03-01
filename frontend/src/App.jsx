import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home'
import LoginPage from './pages/Login/login'
import { Toaster } from 'react-hot-toast'
import AdminDashboard from './Pages/Admin/adminDashboard'

function App() {

  return (
    <BrowserRouter>
    <Toaster position="top-right" />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/admin' element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
