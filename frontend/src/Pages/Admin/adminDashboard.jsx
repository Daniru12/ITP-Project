// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';

const AdminDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedNav, setSelectedNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New user registration: Emma Thompson', time: '10 mins ago' },
    { id: 2, text: 'Service booking: Dog Grooming', time: '25 mins ago' },
    { id: 3, text: 'Review posted for Pet Training', time: '1 hour ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const users = [
    { id: 'USR001', name: 'Oliver Wilson', email: 'oliver.wilson@email.com', registrationDate: '2025-02-15', status: 'active', avatar: 'https://public.readdy.ai/ai/img_res/e7c22638c068191a919e0abb214a7a84.jpg' },
    { id: 'USR002', name: 'Isabella Martinez', email: 'isabella.m@email.com', registrationDate: '2025-02-20', status: 'active', avatar: 'https://public.readdy.ai/ai/img_res/896a07f61dab33ec28ee5a34a2283bf3.jpg' },
    { id: 'USR003', name: 'James Anderson', email: 'j.anderson@email.com', registrationDate: '2025-02-28', status: 'blocked', avatar: 'https://public.readdy.ai/ai/img_res/bcd4671cae2af4ccf6e5cfbb123a1982.jpg' },
  ];

  const services = [
    { id: 'SRV001', name: 'Premium Dog Grooming', provider: 'PawPerfect Salon', price: 75, status: 'active', rating: 4.8 },
    { id: 'SRV002', name: 'Cat Behavior Training', provider: 'Feline Experts Co.', price: 90, status: 'active', rating: 4.9 },
    { id: 'SRV003', name: 'Pet Dental Care', provider: 'VetCare Plus', price: 120, status: 'pending', rating: 4.7 },
  ];

  useEffect(() => {
    const userGrowthChart = echarts.init(document.getElementById('userGrowthChart'));
    const revenueChart = echarts.init(document.getElementById('revenueChart'));

    const userGrowthOption = {
      animation: false,
      title: { text: 'User Growth', left: 'center' },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      yAxis: { type: 'value' },
      series: [{
        data: [150, 230, 224, 318, 435, 570],
        type: 'line',
        smooth: true,
        color: '#6366f1'
      }]
    };

    const revenueOption = {
      animation: false,
      title: { text: 'Revenue Trends', left: 'center' },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      yAxis: { type: 'value' },
      series: [{
        data: [8500, 12800, 15600, 19200, 22400, 28600],
        type: 'bar',
        color: '#10b981'
      }]
    };

    userGrowthChart.setOption(userGrowthOption);
    revenueChart.setOption(revenueOption);

    return () => {
      userGrowthChart.dispose();
      revenueChart.dispose();
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg ${isSidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between border-b">
          <img src="https://public.readdy.ai/ai/img_res/6638ffcdc855c40776712ff1a7c1fbfd.jpg" 
               alt="PetCare Admin" 
               className={`${isSidebarCollapsed ? 'w-12' : 'w-32'} transition-all duration-300`} />
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="!rounded-button text-gray-500 hover:text-gray-700">
            <i className={`fas ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>

        <nav className="mt-6">
          {[
            { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
            { id: 'users', icon: 'fa-users', label: 'Users' },
            { id: 'services', icon: 'fa-paw', label: 'Services' },
            { id: 'bookings', icon: 'fa-calendar-check', label: 'Bookings' },
            { id: 'reports', icon: 'fa-chart-bar', label: 'Reports' },
            { id: 'settings', icon: 'fa-cog', label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedNav(item.id)}
              className={`w-full p-4 flex items-center ${selectedNav === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'} !rounded-button cursor-pointer`}
            >
              <i className={`fas ${item.icon} ${isSidebarCollapsed ? 'text-xl' : 'w-6'}`}></i>
              {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center">
            <img src="https://public.readdy.ai/ai/img_res/e47b10aaa4473c2f8f57f90c96223404.jpg" 
                 alt="Admin" 
                 className="w-10 h-10 rounded-full" />
            {!isSidebarCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Sarah Mitchell</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="!rounded-button relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <i className="fas fa-bell"></i>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-4 border-b hover:bg-gray-50">
                          <p className="text-sm text-gray-700">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <i className="far fa-calendar-alt mr-2"></i>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { title: 'Total Users', value: '1,234', change: '+12.5%', icon: 'fa-users', color: 'text-blue-600' },
              { title: 'Active Services', value: '86', change: '+5.3%', icon: 'fa-paw', color: 'text-green-600' },
              { title: "Today's Bookings", value: '28', change: '+8.1%', icon: 'fa-calendar-check', color: 'text-purple-600' },
              { title: 'Revenue', value: '$28,650', change: '+15.2%', icon: 'fa-dollar-sign', color: 'text-yellow-600' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.color} bg-opacity-10 p-3 rounded-full`}>
                    <i className={`fas ${stat.icon} text-xl`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div id="userGrowthChart" style={{ height: '300px' }}></div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div id="revenueChart" style={{ height: '300px' }}></div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600 border-b">
                    <th className="pb-3">User ID</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Registration Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="py-4">{user.id}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                          {user.name}
                        </div>
                      </td>
                      <td className="py-4">{user.email}</td>
                      <td className="py-4">{user.registrationDate}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="!rounded-button text-blue-600 hover:text-blue-800">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="!rounded-button text-red-600 hover:text-red-800">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Services</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600 border-b">
                    <th className="pb-3">Service ID</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Provider</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service.id} className="border-b">
                      <td className="py-4">{service.id}</td>
                      <td className="py-4">{service.name}</td>
                      <td className="py-4">{service.provider}</td>
                      <td className="py-4">${service.price}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">{service.rating}</span>
                          <i className="fas fa-star text-yellow-500"></i>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="!rounded-button text-blue-600 hover:text-blue-800">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="!rounded-button text-red-600 hover:text-red-800">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

