import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/home'
import LoginPage from './Pages/Login/login'
import { Toaster } from 'react-hot-toast'
import AdminDashboard from './Pages/Admin/adminDashboard'
import RegisterPage from './Pages/Register/register'
import NavBar from './Components/NavBar'
import Profile from './Pages/PetOwner/profile'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <NavBar />
      <div className="pt-4">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
