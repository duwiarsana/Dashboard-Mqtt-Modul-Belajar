import React from 'react';
import { useMqtt } from '../contexts/MqttContext';
import { 
  Zap, 
  Thermometer, 
  Droplet, 
  Battery, 
  Clock, 
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

// Menghitung biaya listrik berdasarkan pemakaian energi (kWh)
const calculateElectricityCost = (energy: string): number => {
  const energyValue = parseFloat(energy) || 0;
  return Math.round(energyValue * 1500); // Rp 1.500 per kWh
};

export const RoomCard: React.FC<RoomCardProps> = ({ name, topics }) => {
  const { messages, publish } = useMqtt();
  
  const getValue = (topic: string, defaultValue: string = '0'): string => {
    const value = messages[topic];
    return value !== undefined && value !== null ? String(value) : defaultValue;
  };

  const getNumericValue = (topic: string, defaultValue: number = 0): number => {
    const value = messages[topic];
    return value !== undefined && value !== null ? parseFloat(String(value)) : defaultValue;
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
  const electricityCost = calculateElectricityCost(getValue(topics.energy, '0'));
  const waterCost = getNumericValue(topics.waterCost, 0);
  const power = getNumericValue(topics.power, 0);
  const voltage = getNumericValue(topics.voltage, 0);
  const current = getNumericValue(topics.current, 0);
  const temperature = getNumericValue(topics.temperature, 0);
  const humidity = getNumericValue(topics.humidity, 0);
  const water = getNumericValue(topics.water, 0);
  const energy = getNumericValue(topics.energy, 0);

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
    <div className="flex items-start space-x-1.5">
      <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
        <Icon className="w-3 h-3" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate">{label}</p>
        <p className="font-medium text-xs xs:text-sm truncate leading-tight">
          {value}{unit && <span className="text-[10px] text-gray-400 ml-0.5">{unit}</span>}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col">
      {/* Header */}
      <div className={`p-2 border-b ${isPaid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${isPowerOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{name}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <div className="text-right">
              <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Rp{electricityCost.toLocaleString('id-ID')}
              </p>
            </div>
            <div className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
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
      <div className="p-2 flex-1">
        <div className="grid grid-cols-2 gap-2">
          {/* Listrik */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              <Zap className="w-3 h-3 xs:w-4 xs:h-4 mr-1.5 text-yellow-500 flex-shrink-0" />
              <span className="truncate">Listrik</span>
            </div>
            <div className="space-y-3">
              <StatItem 
                icon={Gauge} 
                label="Daya" 
                value={power.toFixed(2)} 
                unit="W" 
              />
              <StatItem 
                icon={Battery} 
                label="Tegangan" 
                value={voltage.toFixed(1)} 
                unit="V" 
              />
              <StatItem 
                icon={Zap} 
                label="Arus" 
                value={current.toFixed(2)} 
                unit="A" 
              />
              <StatItem 
                icon={CircleDollarSign} 
                label="Biaya Listrik" 
                value={`Rp${electricityCost.toLocaleString('id-ID')}`} 
                unit="" 
              />
              <StatItem 
                icon={Droplet} 
                label="Biaya Air" 
                value={`Rp${waterCost.toLocaleString('id-ID')}`} 
                unit="" 
              />
            </div>
          </div>
          
          {/* Sensor */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              <Thermometer className="w-3 h-3 xs:w-4 xs:h-4 mr-1.5 text-red-500 flex-shrink-0" />
              <span className="truncate">Sensor</span>
            </div>
            <div className="space-y-3">
              <StatItem 
                icon={Thermometer} 
                label="Suhu" 
                value={temperature.toFixed(1)} 
                unit="°C" 
              />
              <StatItem 
                icon={Droplets} 
                label="Kelembaban" 
                value={humidity.toFixed(0)} 
                unit="%" 
              />
              <StatItem 
                icon={Droplet} 
                label="Pemakaian Air" 
                value={water.toFixed(1)} 
                unit="L" 
              />
              <StatItem 
                icon={Clock} 
                label="kWh" 
                value={energy.toFixed(2)} 
                unit="kWh" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-700/30 p-1.5 border-t border-gray-100 dark:border-gray-700">
        <div className="flex space-x-2">
          <button 
            onClick={togglePower}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded transition-colors ${
              isPowerOn 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white'
            }`}
          >
            <Power className="w-3 h-3" />
            <span className="truncate">{isPowerOn ? 'Matikan' : 'Nyalakan'}</span>
          </button>
          
          <button 
            onClick={markAsPaid}
            disabled={isPaid}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded transition-colors ${
              isPaid 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 cursor-default' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            <span className="truncate">{isPaid ? 'Sudah Dibayar' : 'Tandai Lunas'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
