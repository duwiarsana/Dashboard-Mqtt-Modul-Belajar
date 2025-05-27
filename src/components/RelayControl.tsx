import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useMqtt } from '../contexts/MqttContext';
import { Switch } from '@headlessui/react';
import { LightBulbIcon, PowerIcon } from '@heroicons/react/24/outline';

interface RelayControlProps {
  relay1Topic: string;
  relay2Topic: string;
  publishTopic: string;
}

export const RelayControl: React.FC<RelayControlProps> = ({
  relay1Topic,
  relay2Topic,
  publishTopic,
}) => {
  const { messages, publish } = useMqtt();
  
  // Initialize states with default values
  const [relay1, setRelay1] = useState(false);
  const [relay2, setRelay2] = useState(false);

  // Update relay states when MQTT messages arrive
  useEffect(() => {
    if (messages[relay1Topic] !== undefined) {
      setRelay1(messages[relay1Topic] === '1');
    }
    if (messages[relay2Topic] !== undefined) {
      setRelay2(messages[relay2Topic] === '1');
    }

  }, [messages, relay1Topic, relay2Topic]);

  const toggleRelay = (relayNumber: number, newState: boolean) => {
    const relayState = newState ? '1' : '0';
    const message = `${relayNumber}:${relayState}`;
    publish(publishTopic, message);
    
    // Update local state immediately for better UX
    switch (relayNumber) {
      case 1: setRelay1(newState); break;
      case 2: setRelay2(newState); break;

    }
  };

  const RelaySwitch = ({
    relayNumber,
    enabled,
    label,
    icon,
  }: {
    relayNumber: number;
    enabled: boolean;
    label: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {enabled ? 'ON' : 'OFF'}
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        onChange={(newState) => toggleRelay(relayNumber, newState)}
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader
        title="Relay Control"
        subtitle="Control your devices"
        icon={
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
            <PowerIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        }
      />
      <CardContent className="space-y-4">
        <RelaySwitch
          relayNumber={1}
          enabled={relay1}
          label="Relay 1"
          icon={<LightBulbIcon className="h-5 w-5" />}
        />
        <RelaySwitch
          relayNumber={2}
          enabled={relay2}
          label="Relay 2"
          icon={<LightBulbIcon className="h-5 w-5" />}
        />
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Relay Control Info
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  Toggle the switches to control your devices. The state will be updated in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
