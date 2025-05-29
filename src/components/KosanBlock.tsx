import React from 'react';
import { useMqtt } from '../contexts/MqttContext';
import { Power, CheckCircle, Zap, Thermometer } from 'lucide-react';

interface KosanBlockProps {
  blockId: number;
  name: string;
  topics: {
    voltage: string;
    current: string;
    power: string;
    powerFactor: string;
    energy: string;
    cost: string;
    temperature: string;
    humidity: string;
    light: string;
    water: string;
    relay: string;
    paymentStatus: string;
  };
}

export const KosanBlock: React.FC<KosanBlockProps> = ({ blockId, name, topics }) => {
  const { messages, publish } = useMqtt();
  
  // Ambil nilai dari MQTT messages
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className={`p-4 border-b ${isPaid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
        <h3 className="text-lg font-semibold">{name} (Blok {blockId})</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm font-medium">Status: {isPaid ? 'Lunas' : 'Belum Lunas'}</span>
          <div className={`w-3 h-3 rounded-full ${isPowerOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Listrik */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Zap className="w-4 h-4 mr-1" /> Listrik
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>⚡ Daya:</div>
              <div className="text-right">{getValue(topics.power, '0')} W</div>
              
              <div>🔌 Tegangan:</div>
              <div className="text-right">{getValue(topics.voltage, '0')} V</div>
              
              <div>🔋 Arus:</div>
              <div className="text-right">{getValue(topics.current, '0')} A</div>
              
              <div>📊 Faktor Daya:</div>
              <div className="text-right">{getValue(topics.powerFactor, '0')}</div>
              
              <div>💡 kWh:</div>
              <div className="text-right">{getValue(topics.energy, '0')} kWh</div>
              
              <div>💸 Biaya:</div>
              <div className="text-right font-medium">Rp {parseFloat(getValue(topics.cost, '0')).toLocaleString()}</div>
            </div>
          </div>
          
          {/* Sensor */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Thermometer className="w-4 h-4 mr-1" /> Sensor
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>🌡 Suhu:</div>
              <div className="text-right">{getValue(topics.temperature, '0')}°C</div>
              
              <div>💧 Kelembaban:</div>
              <div className="text-right">{getValue(topics.humidity, '0')}%</div>
              
              <div>☀️ Cahaya:</div>
              <div className="text-right">{getValue(topics.light, '0')} lx</div>
              
              <div>🚿 Air:</div>
              <div className="text-right">{getValue(topics.water, '0')} L</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t">
        <div className="flex space-x-2 w-full">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md ${
              isPowerOn 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white'
            }`}
            onClick={togglePower}
          >
            <Power className="w-4 h-4" />
            {isPowerOn ? 'Matikan Listrik' : 'Nyalakan Listrik'}
          </button>
          
          <button 
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md ${
              isPaid 
                ? 'border border-green-500 text-green-600 dark:text-green-400'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={markAsPaid}
            disabled={isPaid}
          >
            <CheckCircle className="w-4 h-4" />
            {isPaid ? 'Sudah Dibayar' : 'Tandai Lunas'}
          </button>
        </div>
      </div>
    </div>
  );
};
