import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useMqtt } from '../contexts/MqttContext';
import { FireIcon, SunIcon } from '@heroicons/react/24/outline';

interface EnvironmentSensorsProps {
  temperatureTopic: string;
  humidityTopic: string;
  lightTopic?: string; // Made optional
}

export const EnvironmentSensors: React.FC<EnvironmentSensorsProps> = ({
  temperatureTopic,
  humidityTopic,
  lightTopic,
}) => {
  const { messages } = useMqtt();
  
  const temperature = parseFloat(messages[temperatureTopic] || '0');
  const humidity = parseFloat(messages[humidityTopic] || '0');
  const lightLevel = lightTopic ? parseFloat(messages[lightTopic] || '0') : 0;

  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return 'text-blue-500';
    if (temp > 30) return 'text-red-500';
    return 'text-green-500';
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return 'text-yellow-500';
    if (humidity > 70) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title="Environment Sensors"
        subtitle="Real-time environmental data"
        icon={
          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
            <FireIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        }
      />
      <CardContent className="pt-4 pb-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Temperature */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-2">
              <FireIcon className={`h-8 w-8 ${getTemperatureColor(temperature)}`} />
            </div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</h4>
            <p className={`text-2xl font-semibold ${getTemperatureColor(temperature)}`}>
              {temperature.toFixed(1)}°C
            </p>
          </div>

          {/* Humidity */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 ${getHumidityColor(humidity)}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Humidity</h4>
            <p className={`text-2xl font-semibold ${getHumidityColor(humidity)}`}>
              {humidity.toFixed(0)}%
            </p>
          </div>

          {/* Light Level - Only show if lightTopic is provided */}
          {lightTopic && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-50 dark:bg-yellow-900/20 mb-2">
                <SunIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Light Level</h4>
              <p className="text-2xl font-semibold text-yellow-500">
                {lightLevel.toFixed(0)}%
              </p>
            </div>
          )}
        </div>

        {/* Light Level Bar - Only show if lightTopic is provided */}
        {lightTopic && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>0%</span>
              <span>Light Level</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: `${lightLevel}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
