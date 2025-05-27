import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useMqtt } from '../contexts/MqttContext';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ParkingStatusProps {
  topic: string;
}

export const ParkingStatus: React.FC<ParkingStatusProps> = ({ topic }) => {
  const { messages } = useMqtt();
  const status = messages[topic]?.toLowerCase() === 'true';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title="Parking Status"
        subtitle="Real-time parking availability"
        icon={
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        }
      />
      <CardContent className="pt-4 pb-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
            {status ? (
              <XCircleIcon className="h-14 w-14 text-red-500" />
            ) : (
              <CheckCircleIcon className="h-14 w-14 text-green-500" />
            )}
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            {status ? 'Parking Full' : 'Parking Available'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {status
              ? 'No available parking spots'
              : 'Parking spots available'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
