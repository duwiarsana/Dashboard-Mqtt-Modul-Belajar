import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  FiSun, 
  FiMoon, 
  FiHome, 
  FiSettings, 
  FiMenu,
  FiPower,
  FiActivity,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiLogOut
} from 'react-icons/fi';

import { useMqtt } from './contexts/MqttContext';
import DeviceManagement from './pages/DeviceManagement';

// MQTT Configuration
const MQTT_CONFIG = {
  brokerUrl: 'ws://202.74.74.42:8084',
  options: {
    clientId: 'modul-belajar-' + Math.random().toString(16).substr(2, 8),
    clean: true,
    protocol: 'ws' as const,
    wsOptions: {
      rejectUnauthorized: false
    }
  },
  rooms: {
    1: {
      name: 'K.01',
      topics: {
        voltage: 'kost/kamar01/voltage',
        current: 'kost/kamar01/current',
        power: 'kost/kamar01/power',
        powerFactor: 'kost/kamar01/power_factor',
        energy: 'kost/kamar01/energy',
        electricityCost: 'kost/kamar01/cost/electricity',
        waterCost: 'kost/kamar01/cost/water',
        temperature: 'kost/kamar01/temperature',
        humidity: 'kost/kamar01/humidity',
        water: 'kost/kamar01/water',
        relay: 'kost/kamar01/relay/control',
        paymentStatus: 'kost/kamar01/payment/status'
      }
    },
    2: {
      name: 'K.02',
      topics: {
        voltage: 'kost/kamar02/voltage',
        current: 'kost/kamar02/current',
        power: 'kost/kamar02/power',
        powerFactor: 'kost/kamar02/power_factor',
        energy: 'kost/kamar02/energy',
        electricityCost: 'kost/kamar02/cost/electricity',
        waterCost: 'kost/kamar02/cost/water',
        temperature: 'kost/kamar02/temperature',
        humidity: 'kost/kamar02/humidity',
        water: 'kost/kamar02/water',
        relay: 'kost/kamar02/relay/control',
        paymentStatus: 'kost/kamar02/payment/status'
      }
    },
    3: {
      name: 'K.03',
      topics: {
        voltage: 'kost/kamar03/voltage',
        current: 'kost/kamar03/current',
        power: 'kost/kamar03/power',
        powerFactor: 'kost/kamar03/power_factor',
        energy: 'kost/kamar03/energy',
        electricityCost: 'kost/kamar03/cost/electricity',
        waterCost: 'kost/kamar03/cost/water',
        temperature: 'kost/kamar03/temperature',
        humidity: 'kost/kamar03/humidity',
        water: 'kost/kamar03/water',
        relay: 'kost/kamar03/relay/control',
        paymentStatus: 'kost/kamar03/payment/status'
      }
    },
    4: {
      name: 'K.04',
      topics: {
        voltage: 'kost/kamar04/voltage',
        current: 'kost/kamar04/current',
        power: 'kost/kamar04/power',
        powerFactor: 'kost/kamar04/power_factor',
        energy: 'kost/kamar04/energy',
        electricityCost: 'kost/kamar04/cost/electricity',
        waterCost: 'kost/kamar04/cost/water',
        temperature: 'kost/kamar04/temperature',
        humidity: 'kost/kamar04/humidity',
        water: 'kost/kamar04/water',
        relay: 'kost/kamar04/relay/control',
        paymentStatus: 'kost/kamar04/payment/status'
      }
    },
    5: {
      name: 'K.05',
      topics: {
        voltage: 'kost/kamar05/voltage',
        current: 'kost/kamar05/current',
        power: 'kost/kamar05/power',
        powerFactor: 'kost/kamar05/power_factor',
        energy: 'kost/kamar05/energy',
        electricityCost: 'kost/kamar05/cost/electricity',
        waterCost: 'kost/kamar05/cost/water',
        temperature: 'kost/kamar05/temperature',
        humidity: 'kost/kamar05/humidity',
        water: 'kost/kamar05/water',
        relay: 'kost/kamar05/relay/control',
        paymentStatus: 'kost/kamar05/payment/status'
      }
    },
    6: {
      name: 'K.06',
      topics: {
        voltage: 'kost/kamar06/voltage',
        current: 'kost/kamar06/current',
        power: 'kost/kamar06/power',
        powerFactor: 'kost/kamar06/power_factor',
        energy: 'kost/kamar06/energy',
        electricityCost: 'kost/kamar06/cost/electricity',
        waterCost: 'kost/kamar06/cost/water',
        temperature: 'kost/kamar06/temperature',
        humidity: 'kost/kamar06/humidity',
        water: 'kost/kamar06/water',
        relay: 'kost/kamar06/relay/control',
        paymentStatus: 'kost/kamar06/payment/status'
      }
    },
    7: {
      name: 'K.07',
      topics: {
        voltage: 'kost/kamar07/voltage',
        current: 'kost/kamar07/current',
        power: 'kost/kamar07/power',
        powerFactor: 'kost/kamar07/power_factor',
        energy: 'kost/kamar07/energy',
        electricityCost: 'kost/kamar07/cost/electricity',
        waterCost: 'kost/kamar07/cost/water',
        temperature: 'kost/kamar07/temperature',
        humidity: 'kost/kamar07/humidity',
        water: 'kost/kamar07/water',
        relay: 'kost/kamar07/relay/control',
        paymentStatus: 'kost/kamar07/payment/status'
      }
    },
     8: {
      name: 'K.08',
      topics: {
        voltage: 'kost/kamar08/voltage',
        current: 'kost/kamar08/current',
        power: 'kost/kamar08/power',
        powerFactor: 'kost/kamar08/power_factor',
        energy: 'kost/kamar08/energy',
        electricityCost: 'kost/kamar08/cost/electricity',
        waterCost: 'kost/kamar08/cost/water',
        temperature: 'kost/kamar08/temperature',
        humidity: 'kost/kamar08/humidity',
        water: 'kost/kamar08/water',
        relay: 'kost/kamar08/relay/control',
        paymentStatus: 'kost/kamar08/payment/status'
      }
    },
    9: {
      name: 'K.09',
      topics: {
        voltage: 'kost/kamar09/voltage',
        current: 'kost/kamar09/current',
        power: 'kost/kamar09/power',
        powerFactor: 'kost/kamar09/power_factor',
        energy: 'kost/kamar09/energy',
        electricityCost: 'kost/kamar09/cost/electricity',
        waterCost: 'kost/kamar09/cost/water',
        temperature: 'kost/kamar09/temperature',
        humidity: 'kost/kamar09/humidity',
        water: 'kost/kamar09/water',
        relay: 'kost/kamar09/relay/control',
        paymentStatus: 'kost/kamar09/payment/status'
      }
    },
    10: {
      name: 'K.10',
      topics: {
        voltage: 'kost/kamar10/voltage',
        current: 'kost/kamar10/current',
        power: 'kost/kamar10/power',
        powerFactor: 'kost/kamar10/power_factor',
        energy: 'kost/kamar10/energy',
        electricityCost: 'kost/kamar10/cost/electricity',
        waterCost: 'kost/kamar10/cost/water',
        temperature: 'kost/kamar10/temperature',
        humidity: 'kost/kamar10/humidity',
        water: 'kost/kamar10/water',
        relay: 'kost/kamar10/relay/control',
        paymentStatus: 'kost/kamar10/payment/status'
      }
    }
  }
};

import { RoomCard } from './components/RoomCard';

const Dashboard: React.FC = () => {
  const { isConnected } = useMqtt();

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Kost Management Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            Jl. Tukad Yeh Aya No. 18x Panjer, Denpasar - Bali
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {Object.entries(MQTT_CONFIG.rooms).map(([id, room]) => (
            <div key={id} className="h-full">
              <RoomCard 
                roomId={parseInt(id)}
                name={room.name}
                topics={room.topics}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sidebar component
const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  const location = useLocation();
  const { isConnected } = useMqtt();

  const navItems = [
    { to: "/", icon: FiHome, label: "Dashboard" },
    { to: "/devices", icon: FiSettings, label: "Device Management" },
    { to: "/reports", icon: FiActivity, label: "Reports" },
    { to: "/billing", icon: FiDollarSign, label: "Billing" },
    { to: "/tenants", icon: FiUsers, label: "Tenants" },
    { to: "/history", icon: FiClock, label: "History" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FiPower className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">KostKu</span>
            </div>
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                    location.pathname === item.to
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Connection Status */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={() => {}}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || 
             (!('theme' in localStorage) && 
              window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.theme = !darkMode ? 'dark' : 'light';
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <FiPower className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">KostKu</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2 space-y-1">
              {[
                { to: "/", icon: FiHome, label: "Dashboard" },
                { to: "/devices", icon: FiSettings, label: "Device Management" },
                { to: "/reports", icon: FiActivity, label: "Reports" },
                { to: "/billing", icon: FiDollarSign, label: "Billing" },
                { to: "/tenants", icon: FiUsers, label: "Tenants" },
                { to: "/history", icon: FiClock, label: "History" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                    location.pathname === item.to
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
          
          {/* Connection Status */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Connected
                </span>
              </div>
              <button
                onClick={() => {}}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={toggleSidebar}
      />

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FiPower className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">KostKu</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2 space-y-1">
              {[
                { to: "/", icon: FiHome, label: "Dashboard" },
                { to: "/devices", icon: FiSettings, label: "Device Management" },
                { to: "/reports", icon: FiActivity, label: "Reports" },
                { to: "/billing", icon: FiDollarSign, label: "Billing" },
                { to: "/tenants", icon: FiUsers, label: "Tenants" },
                { to: "/history", icon: FiClock, label: "History" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                    location.pathname === item.to
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Connection Status */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Connected
                </span>
              </div>
              <button
                onClick={() => {}}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2 md:hidden"
                >
                  <FiMenu className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {location.pathname === '/'
                    ? 'Dashboard'
                    : location.pathname === '/devices'
                    ? 'Device Management'
                    : location.pathname
                        .replace(/^\//, '')
                        .charAt(0)
                        .toUpperCase() +
                        location.pathname
                          .replace(/^\//, '')
                          .slice(1)
                          .replace('-', ' ')}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    AD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
          <div className="max-w-full mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devices" element={<DeviceManagement />} />
                <Route
                  path="*"
                  element={
                    <div className="p-8 text-center text-gray-500">
                      Page not found
                    </div>
                  }
                />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
