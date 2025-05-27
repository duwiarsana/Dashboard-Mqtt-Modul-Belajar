import React, { useEffect } from 'react';
import { MqttProvider, useMqtt } from './contexts/MqttContext';
import { ParkingStatus } from './components/ParkingStatus';
import { EnvironmentSensors } from './components/EnvironmentSensors';
import { WaterPumpControl } from './components/WaterPumpControl';
import { LightIcon, TemperatureIcon, ParkingIcon, PowerIcon } from './components/Icons';

import { mqttConfig } from './config/mqtt';

// MQTT Configuration
const MQTT_CONFIG = {
  url: mqttConfig.brokerUrl,
  options: {
    ...mqttConfig.options,
    clientId: 'modul-belajar-' + Math.random().toString(16).substr(2, 8),
  },
  topics: {
    // Topik yang digunakan di aplikasi
    parking: 'sensor/parking',
    temperature: 'sensor/suhu',
    humidity: 'sensor/kelembaban',
    light: 'sensor/cahaya',  // Menambahkan topik untuk sensor cahaya
    waterLevel: 'sensor/waterlevel',
    relay1: 'relay/1',
    relay2: 'relay/2',
    relayControl: 'relay/control',
  },
};

const Dashboard: React.FC = () => {
  const { connect, isConnected } = useMqtt();

  useEffect(() => {
    connect();
  }, [connect]);
  
  // Hapun MQTT_CONFIG yang tidak digunakan lagi

  // Subscribe sudah ditangani di MqttContext

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              MQTT Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={() => {
                  document.documentElement.classList.toggle('dark');
                  localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                }}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              >
                <LightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Status Cards */}
          {[
            { icon: <ParkingIcon className="h-6 w-6" />, title: 'Parking Status', value: isConnected ? 'Connected' : '--', color: 'blue' },
            { icon: <TemperatureIcon className="h-6 w-6" />, title: 'Temperature', value: isConnected ? 'Connected' : '--°C', color: 'red' },
            { icon: <LightIcon className="h-6 w-6" />, title: 'Water Level', value: isConnected ? 'Connected' : '--%', color: 'cyan' },
            { icon: <PowerIcon className="h-6 w-6" />, title: 'Pump Control', value: isConnected ? 'Connected' : 'Offline', color: 'purple' },
          ].map((card, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900/30 text-${card.color}-600 dark:text-${card.color}-400`}>
                    {card.icon}
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column - Parking Status */}
          <div className="lg:col-span-1">
            <ParkingStatus topic={MQTT_CONFIG.topics.parking} />
          </div>
          
          {/* Middle Column - Environment Sensors */}
          <div className="lg:col-span-1">
            <EnvironmentSensors 
              temperatureTopic={MQTT_CONFIG.topics.temperature}
              humidityTopic={MQTT_CONFIG.topics.humidity}
              lightTopic={MQTT_CONFIG.topics.light}
            />
          </div>

          {/* Right Column - Water Pump Control */}
          <div className="lg:col-span-1">
            <WaterPumpControl 
              waterLevelTopic={MQTT_CONFIG.topics.waterLevel}
              relayTopic={MQTT_CONFIG.topics.relay1}
              publishTopic={MQTT_CONFIG.topics.relay1} // Mengirim langsung ke relay/1
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 mt-12 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} MQTT Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  // Check for dark mode preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <MqttProvider>
      <Dashboard />
    </MqttProvider>
  );
};

export default App;
