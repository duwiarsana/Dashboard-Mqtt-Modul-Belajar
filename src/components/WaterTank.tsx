import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useMqtt } from '../contexts/MqttContext';
import { WaterDropIcon } from './Icons';

interface WaterTankProps {
  topic: string;
}

export const WaterTank: React.FC<WaterTankProps> = ({ topic }) => {
  const { messages } = useMqtt();
  const level = parseFloat(messages[topic] || '0');
  const percentage = Math.min(100, Math.max(0, level)); // Ensure percentage is between 0-100

  const getWaterLevelColor = (level: number) => {
    if (level < 20) return 'bg-red-500';
    if (level < 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getWaterLevelStatus = (level: number) => {
    if (level < 20) return 'Low';
    if (level < 50) return 'Medium';
    return 'Good';
  };

  return (
    <Card className="h-full">
      <CardHeader
        title="Water Tank Level"
        subtitle={`Status: ${getWaterLevelStatus(level)}`}
        icon={
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <WaterDropIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        }
      />
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Water Tank Visualization */}
          <div className="relative w-40 h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden mb-4">
            {/* Water */}
            <div 
              className={`absolute bottom-0 left-0 right-0 ${getWaterLevelColor(level)} transition-all duration-500`}
              style={{ height: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
            
            {/* Water surface */}
            <div 
              className="absolute left-0 right-0 h-2 bg-blue-300/50"
              style={{ bottom: `calc(${percentage}% - 1px)` }}
            ></div>
            
            {/* Tank frame */}
            <div className="absolute inset-0 border-4 border-transparent border-t-gray-400 dark:border-t-gray-500"></div>
          </div>
          
          {/* Percentage */}
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {Math.round(percentage)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current water level
            </p>
          </div>
          
          {/* Status indicators */}
          <div className="w-full mt-6">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${getWaterLevelColor(level)}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt  -1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Empty</span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {getWaterLevelStatus(level)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Full</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
