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
import CreateFaq from './Pages/FAQ/faq'
import PaymentPage from './Pages/Payment/PaymentPage'
import { PetCareBooking } from './Pages/Booking/Create/PetCareBooking'


import AppointmentsList from './Pages/Appoiment/appoiments'
import UpdateAppointment from './Pages/Appoiment/UpdateAppointment'
import AppointmentCreate from './Pages/Appoiment/AppointmentCreate'
import UserAppointments from './Pages/Appoiment/UserAppointments'
import CreateReview from './Pages/Review/review'

import DisplayServices from './Pages/Home/displayServices'
import ServiceOverview from './Pages/Home/serviceOverview'
import AddBoarding from './Pages/Providers/addBoarding'
import AddTraining from './Pages/Providers/addTraining'



import UpdatePet from './Pages/PetOwner/updatePet'
import UpdateService from './Pages/Providers/updateService'
import CreateBoedingScheduleForm from './Pages/Schedule/bordingschedule/CreateScheduleForm'
import BoardingScheduleList from './Pages/Schedule/bordingschedule/ScheduleList';
import UpdateBoedingScheduleForm from './Pages/Schedule/bordingschedule/UpdateBoedingScheduleForm'
import CreateGroomingScheduleForm from './Pages/Schedule/PetGrromingScheduling/CreateGroomingScheduleForm'
import GroomingScheduleList from "./Pages/Schedule/PetGrromingScheduling/GroomingScheduleList";

// Product Marketplace
import ProductDetail from './Pages/productMarket/ProductDetail'
import PetMarketplace from './Pages/productMarket/PetMarketplace'
import CreateProduct from './Pages/productMarket/CreateProduct'

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
            <Route path="Services" element={<ServiceManagement />} />
            <Route path="AllPets" element={<PetsManagement />} />
            <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-semibold mb-6">Admin Settings</h2></div>} />
          </Route>

          <Route path='/register' element={<RegisterPage />} />
          <Route path='/booking' element={<PetCareBooking />} />
          
          <Route path='/AppointmentLIST' element={<AppointmentsList />} />
          <Route path='/Appointmentadd/:id' element={<AppointmentCreate />} />
          <Route path='/Appointment' element={<UserAppointments />} />
          <Route path="/appointments/update/:id" element={<UpdateAppointment />} />

          <Route path="/Groomingscheduleadd" element={<CreateGroomingScheduleForm />} />
          <Route path="/schedule/grooming" element={<GroomingScheduleList />} />
          <Route path="/Bordingscheduleadd" element={<CreateBoedingScheduleForm />} />
          <Route path="/schedule/boarding" element={<BoardingScheduleList />} />
          <Route path="/scheduling/boarding/:id" element={<UpdateBoedingScheduleForm />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/provider-profile' element={<ProviderProfile />} />
          <Route path='/add-grooming' element={<AddGrooming />} />
          <Route path='/add-boarding' element={<AddBoarding />} />
          <Route path='/add-training' element={<AddTraining />} />
          <Route path='/add-service' element={<AddService />} />
          <Route path='/register-pet' element={<RegisterPet />} />
          <Route path='/Faq' element={<CreateFaq />} />  
          <Route path='/PaymentPage' element={<PaymentPage />} />
          <Route path='/display-services' element={<DisplayServices />} />
          <Route path='/service-overview/:id' element={<ServiceOverview />} />

          <Route path='/review' element={<CreateReview />} /> 

          <Route path='/edit-pet/:id' element={<UpdatePet />} />
          <Route path='/update-service/:id' element={<UpdateService />} />

          <Route path='/createproduct' element={<CreateProduct />} />     
          <Route path='/petmarketplace' element={<PetMarketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />

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
  );
}

export default App;
