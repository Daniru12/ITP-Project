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
import PetsManagement from './Pages/Admin/PetsManagement'
import AddGrooming from './Pages/Providers/addGrooming'
import AddService from './Pages/Providers/addService'
import RegisterPet from './Pages/PetOwner/registerPet'
import FAQ from './Pages/FAQ/faq'
import PaymentPage from './Pages/Payment/PaymentPage'
import PaymentForm from './Pages/Payment/PaymentForm'
import OrderSummary from './Pages/Payment/OrderSummary'
import ServiceSummary from './Pages/Payment/ServiceSummary'
import { PetCareBooking } from './Pages/Booking/Create/PetCareBooking'
import Schedule from './Pages/Schedule/groomingSchedule'

import PetMarketplace from './Pages/productMarket/PetMarketplace'  //done



// Wrapper component to handle NavBar conditional rendering
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="bottom-right" />
      {!isAdminRoute && <NavBar />}
      <div className={`${!isAdminRoute ? 'pt-15' : ''}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          
          {/* Admin Dashboard with nested routes */}
          <Route path='/admin' element={<AdminDashboard />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<div className="p-6"><h2 className="text-2xl font-semibold mb-6">Products Management</h2></div>} />
            <Route path="Services" element={<ServiceManagement/>}/>
            <Route path="AllPets" element={<PetsManagement/>}/>
            <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-semibold mb-6">Admin Settings</h2></div>} />
          </Route>
          
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/booking' element={<PetCareBooking />} />
          <Route path='/schedule' element={<Schedule />} />

          <Route path='/profile' element={<Profile />} />
          <Route path='/provider-profile' element={<ProviderProfile />} />
          <Route path='/add-grooming' element={<AddGrooming />} />
          <Route path='/add-service' element={<AddService />} />
          <Route path='/register-pet' element={<RegisterPet />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/PaymentPage' element={<PaymentPage />} />
          <Route path='/PaymentForm' element={<PaymentForm />} />
          <Route path='/OrderSummary' element={<OrderSummary />} />
          <Route path='/ServiceSummary' element={<ServiceSummary />} />
          <Route path='/petmarketplace' element={<PetMarketplace />} />    //done 
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
