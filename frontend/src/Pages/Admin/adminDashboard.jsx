import React, { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiSettings, 
  FiBarChart2, 
  FiMessageSquare, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

// Dashboard components
const DashboardHome = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Users" value="1,245" icon={<FiUsers className="text-blue-500" />} />
      <StatCard title="Total Orders" value="342" icon={<FiShoppingBag className="text-green-500" />} />
      <StatCard title="Revenue" value="$12,345" icon={<FiBarChart2 className="text-purple-500" />} />
      <StatCard title="Messages" value="24" icon={<FiMessageSquare className="text-yellow-500" />} />
    </div>
    
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center border-b pb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <FiUsers className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition">
            <FiUsers className="text-blue-500 text-xl mb-2" />
            <span className="text-sm font-medium">Add User</span>
          </button>
          <button className="p-4 bg-green-50 rounded-lg flex flex-col items-center justify-center hover:bg-green-100 transition">
            <FiShoppingBag className="text-green-500 text-xl mb-2" />
            <span className="text-sm font-medium">New Product</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg flex flex-col items-center justify-center hover:bg-purple-100 transition">
            <FiBarChart2 className="text-purple-500 text-xl mb-2" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-100 transition">
            <FiSettings className="text-yellow-500 text-xl mb-2" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center">
    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-gray-100 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

// Sidebar Item Component
const SidebarItem = ({ icon, text, to, active, onClick, isButton = false }) => {
  const Component = isButton ? 'button' : Link;
  return (
    <Component 
      to={!isButton ? to : undefined}
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{text}</span>
    </Component>
  );
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear any stored authentication tokens/data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Navigate to login page
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 -ml-64'
        } md:ml-0 fixed h-full z-10`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <FiX className="text-xl" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <SidebarItem 
                icon={<FiHome />} 
                text="Dashboard" 
                to="/admin" 
                active={activeItem === 'dashboard'} 
                onClick={() => setActiveItem('dashboard')}
              />
              <SidebarItem 
                icon={<FiUsers />} 
                text="Users" 
                to="/admin/users" 
                active={activeItem === 'users'} 
                onClick={() => setActiveItem('users')}
              />
              <SidebarItem 
                icon={<FiShoppingBag />} 
                text="Products" 
                to="/admin/products" 
                active={activeItem === 'products'} 
                onClick={() => setActiveItem('products')}
              />
              <SidebarItem 
                icon={<FiBarChart2 />} 
                text="Analytics" 
                to="/admin/analytics" 
                active={activeItem === 'analytics'} 
                onClick={() => setActiveItem('analytics')}
              />
              <SidebarItem 
                icon={<FiMessageSquare />} 
                text="Messages" 
                to="/admin/messages" 
                active={activeItem === 'messages'} 
                onClick={() => setActiveItem('messages')}
              />
              <SidebarItem 
                icon={<FiSettings />} 
                text="Settings" 
                to="/admin/settings" 
                active={activeItem === 'settings'} 
                onClick={() => setActiveItem('settings')}
              />
            </div>
          </div>
          
          <div className="p-4 border-t">
            <SidebarItem 
              icon={<FiLogOut />} 
              text="Logout" 
              isButton={true}
              active={false}
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'md:ml-64' : 'ml-0'
      }`}>
        
        {/* Page Content */}
        <main className="p-4">
          <Outlet />
          {/* Render default dashboard if no child route is active */}
          {location.pathname === '/admin' && <DashboardHome />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
