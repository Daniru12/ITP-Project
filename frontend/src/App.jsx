import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './Pages/Home/home'
import LoginPage from './Pages/Login/login'
import { Toaster } from 'react-hot-toast'
import AdminDashboard from './Pages/Admin/adminDashboard'
import RegisterPage from './Pages/Register/register'
import NavBar from './Components/NavBar'
import Profile from './Pages/PetOwner/profile'
import ProviderProfile from './Pages/Providers/providerProfile'
import UserManagement from './Pages/Admin/UserManagement'
import ServiceManagement from './Pages/Admin/ServiceManagement'

// Wrapper component to handle NavBar conditional rendering
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="bottom-right" />
      {!isAdminRoute && <NavBar />}
      <div className={`${!isAdminRoute ? 'pt-4' : ''}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          
          {/* Admin Dashboard with nested routes */}
          <Route path='/admin' element={<AdminDashboard />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<div className="p-6"><h2 className="text-2xl font-semibold mb-6">Products Management</h2></div>} />
            <Route path="Services" element={<ServiceManagement/>}/>
            <Route path="messages" element={<div className="p-6"><h2 className="text-2xl font-semibold mb-6">Messages Center</h2></div>} />
            <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-semibold mb-6">Admin Settings</h2></div>} />
          </Route>
          
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/provider-profile' element={<ProviderProfile />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
