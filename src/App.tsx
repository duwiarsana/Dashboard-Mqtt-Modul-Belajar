import React, { useEffect } from 'react';
import { MqttProvider, useMqtt } from './contexts/MqttContext';
import { RoomCard } from './components/RoomCard';

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

const Dashboard: React.FC = () => {
  const { connect, isConnected, subscribe } = useMqtt();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (isConnected) {
      // Subscribe ke semua topik yang diperlukan untuk setiap kamar
      Object.values(MQTT_CONFIG.rooms).forEach((room: any) => {
        Object.values(room.topics).forEach((topic: any) => {
          subscribe(topic);
        });
      });
    }
  }, [isConnected, subscribe]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-2 py-4 sm:px-6">
      <div className="w-full max-w-[1800px] mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">KOS KOSAN UD PADMA</h1>
          <p className="text-gray-600 dark:text-gray-300">Jalan Tukad Yeh Aya No. 18x Panjer, Denpasar- Bali</p>
        </header>

        <div className="space-y-6">
          {/* Baris 1: Kamar 1-5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-2">
            {[1, 2, 3, 4, 5].map(id => {
              const room = MQTT_CONFIG.rooms[id as keyof typeof MQTT_CONFIG.rooms];
              return (
                <RoomCard 
                  key={id}
                  roomId={id}
                  name={room.name}
                  topics={room.topics}
                />
              );
            })}
          </div>
          
          {/* Baris 2: Kamar 6-10 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-2">
            {[6, 7, 8, 9, 10].map(id => {
              const room = MQTT_CONFIG.rooms[id as keyof typeof MQTT_CONFIG.rooms];
              return (
                <RoomCard 
                  key={id}
                  roomId={id}
                  name={room.name}
                  topics={room.topics}
                />
              );
            })}
          </div>
        </div>
      </div>
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
