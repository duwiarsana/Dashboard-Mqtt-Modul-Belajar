import React from 'react';
import { useMqtt } from '../contexts/MqttContext';
import { 
  Zap, 
  Thermometer, 
  Droplet, 
  Battery, 
  Clock, 
  CreditCard, 
  Power, 
  CheckCircle,
  Droplets,
  CircleDollarSign,
  Gauge
} from 'lucide-react';

interface RoomCardProps {
  roomId: number;
  name: string;
  topics: {
    voltage: string;
    current: string;
    power: string;
    powerFactor: string;
    energy: string;
    electricityCost: string;
    waterCost: string;
    temperature: string;
    humidity: string;
    water: string;
    relay: string;
    paymentStatus: string;
  };
}

export const RoomCard: React.FC<RoomCardProps> = ({ roomId, name, topics }) => {
  const { messages, publish } = useMqtt();
  
  const getValue = (topic: string, defaultValue: string = '0') => {
    return messages[topic] || defaultValue;
  };

  const togglePower = () => {
    const currentState = getValue(topics.relay) === '1';
    publish(topics.relay, currentState ? '0' : '1');
  };

  const markAsPaid = () => {
    publish(topics.paymentStatus, 'paid');
  };

  const isPowerOn = getValue(topics.relay) === '1';
  const isPaid = getValue(topics.paymentStatus) === 'paid';

  const StatItem = ({ 
    icon: Icon, 
    label, 
    value, 
    unit = '' 
  }: { 
    icon: React.ComponentType<{ className?: string }>,
    label: string, 
    value: string | number,
    unit?: string 
  }) => (
    <div className="flex items-center space-x-2">
      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</p>
        <p className="font-medium text-sm truncate">
          {value} {unit}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className={`p-4 border-b ${isPaid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
            <div className="flex items-center mt-1">
              <div className={`w-2 h-2 rounded-full mr-2 ${isPowerOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {isPowerOn ? 'Menyala' : 'Mati'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                Rp {(
                  parseFloat(getValue(topics.electricityCost, '0')) + 
                  parseFloat(getValue(topics.waterCost, '0'))
                ).toLocaleString('id-ID')}
              </p>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isPaid 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
            }`}>
              {isPaid ? 'Lunas' : 'Belum Lunas'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Listrik */}
          <div className="space-y-3">
            <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              <span>Listrik</span>
            </div>
            <div className="space-y-3">
              <StatItem 
                icon={Gauge} 
                label="Daya" 
                value={parseFloat(getValue(topics.power, '0')).toFixed(2)} 
                unit="W" 
              />
              <StatItem 
                icon={Battery} 
                label="Tegangan" 
                value={parseFloat(getValue(topics.voltage, '0')).toFixed(1)} 
                unit="V" 
              />
              <StatItem 
                icon={Zap} 
                label="Arus" 
                value={parseFloat(getValue(topics.current, '0')).toFixed(2)} 
                unit="A" 
              />
              <StatItem 
                icon={CircleDollarSign} 
                label="Biaya Listrik" 
                value={`Rp ${parseFloat(getValue(topics.electricityCost, '0')).toLocaleString('id-ID')}`} 
                unit="" 
              />
              <StatItem 
                icon={Droplet} 
                label="Biaya Air" 
                value={`Rp ${parseFloat(getValue(topics.waterCost, '0')).toLocaleString('id-ID')}`} 
                unit="" 
              />
            </div>
          </div>
          
          {/* Sensor */}
          <div className="space-y-3">
            <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <Thermometer className="w-4 h-4 mr-2 text-red-500" />
              <span>Sensor</span>
            </div>
            <div className="space-y-3">
              <StatItem 
                icon={Thermometer} 
                label="Suhu" 
                value={parseFloat(getValue(topics.temperature, '0')).toFixed(1)} 
                unit="°C" 
              />
              <StatItem 
                icon={Droplets} 
                label="Kelembaban" 
                value={parseFloat(getValue(topics.humidity, '0')).toFixed(0)} 
                unit="%" 
              />
              <StatItem 
                icon={Droplet} 
                label="Pemakaian Air" 
                value={parseFloat(getValue(topics.water, '0')).toFixed(1)} 
                unit="L" 
              />
              <StatItem 
                icon={Clock} 
                label="kWh" 
                value={parseFloat(getValue(topics.energy, '0')).toFixed(2)} 
                unit="kWh" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex space-x-2">
          <button 
            onClick={togglePower}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              isPowerOn 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            {isPowerOn ? 'Matikan' : 'Nyalakan'}
          </button>
          
          <button 
            onClick={markAsPaid}
            disabled={isPaid}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              isPaid 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 cursor-default' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {isPaid ? 'Sudah Dibayar' : 'Tandai Lunas'}
          </button>
        </div>
      </div>
    </div>
  );
};
