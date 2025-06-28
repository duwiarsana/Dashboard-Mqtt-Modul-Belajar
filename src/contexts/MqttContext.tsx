import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import mqtt, { MqttClient, IClientOptions, ISubscriptionGrant } from 'mqtt';

type QoS = 0 | 1 | 2;
import { Device } from '@/types/device';

interface MqttMessage {
  topic: string;
  payload: string;
  timestamp: number;
}

interface MqttContextType {
  client: MqttClient | null;
  isConnected: boolean;
  connect: (device?: Device) => void;
  disconnect: () => void;
  subscribe: (topic: string | string[], callback?: (err: Error | null, granted: ISubscriptionGrant) => void) => void;
  unsubscribe: (topic: string | string[], callback?: (error?: Error) => void) => void;
  publish: (topic: string, message: string, options?: mqtt.IClientPublishOptions) => void;
  messages: Record<string, MqttMessage>;
  activeDevices: Device[];
  setActiveDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  error: string | null;
  clearError: () => void;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Record<string, MqttMessage>>({});
  const [activeDevices, setActiveDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback((device?: Device) => {
    try {
      if (client && client.connected) {
        if (device) {
          // Connect to specific device's MQTT server
          connectToDevice(device);
        }
        return client;
      }

      console.log('[MQTT] Attempting to connect to broker...');
      
      const brokerUrl = device ? `ws://${device.mqttServer}:${device.port}` : 'ws://202.74.74.42:8084';
      
      const options: IClientOptions = {
        clientId: `mqtt-${device?.id || 'dashboard'}-${Math.random().toString(16).substr(2, 8)}`,
        clean: true,
        connectTimeout: 8000,
        keepalive: 60,
        reconnectPeriod: 5000,
        protocol: 'ws',
        rejectUnauthorized: false,
        wsOptions: {
          rejectUnauthorized: false
        }
      };

      const mqttClient = mqtt.connect(brokerUrl, options);

      // Event handlers
      mqttClient.on('connect', () => {
        console.log(`[MQTT] Connected to broker at ${brokerUrl}`);
        setIsConnected(true);
        setError(null);
        
        // If this is a device connection, update its status
        if (device) {
          setActiveDevices(prev => {
            const exists = prev.some(d => d.id === device.id);
            return exists ? prev : [...prev, device];
          });
        } else {
          // Default subscriptions for dashboard
          const topics = [
            'sensor/parking',
            'sensor/suhu',
            'sensor/kelembaban',
            'sensor/waterlevel',
            'relay/1',
            'relay/2',
            'relay/control'
          ];
          
          mqttClient.subscribe(topics, { qos: 0 }, (err, granted) => {
            if (err) {
              console.error('[MQTT] Failed to subscribe to topics:', err);
              setError(`Failed to subscribe to topics: ${err.message}`);
            } else {
              console.log('[MQTT] Subscribed to topics:', granted);
            }
          });
        }
      });

      mqttClient.on('error', (err) => {
        console.error('[MQTT] Connection error:', err);
        setError(`Connection error: ${err.message}`);
        setIsConnected(false);
      });

      mqttClient.on('close', () => {
        console.log('[MQTT] Connection closed');
        setIsConnected(false);
      });

      mqttClient.on('offline', () => {
        console.log('[MQTT] Client offline');
        setIsConnected(false);
      });

      mqttClient.on('message', (topic: string, message: Buffer) => {
        const payload = message.toString();
        const timestamp = Date.now();
        console.log(`[MQTT] Message received on ${topic}: ${payload}`);
        
        setMessages(prev => ({
          ...prev,
          [topic]: {
            topic,
            payload,
            timestamp
          }
        }));
      });

      setClient(mqttClient);
      return mqttClient;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to connect to MQTT broker:', error);
      setError(`Connection failed: ${errorMessage}`);
      setIsConnected(false);
      return null;
    }
  }, []);

  const connectToDevice = useCallback((device: Device) => {
    if (!device || !device.isActive) return;
    
    // Unsubscribe from all topics first
    if (client) {
      client.unsubscribe('#');
      
      // If already connected to this device's server, just subscribe to its topics
      if (client.connected) {
        client.subscribe(device.topics, { qos: 0 }, (err, granted) => {
          if (err) {
            console.error(`[MQTT] Failed to subscribe to device ${device.id} topics:`, err);
            setError(`Failed to subscribe to device ${device.name} topics`);
          } else {
            console.log(`[MQTT] Subscribed to device ${device.id} topics:`, granted);
            setActiveDevices(prev => {
              const exists = prev.some(d => d.id === device.id);
              return exists ? prev : [...prev, device];
            });
          }
        });
      } else {
        // Connect to the device's MQTT server
        connect(device);
      }
    }
  }, [client, connect]);



  const disconnect = useCallback(() => {
    if (client) {
      console.log('[MQTT] Memutuskan koneksi...');
      client.end(true, {}, () => {
        console.log('[MQTT] Koneksi berhasil diputus');
        setClient(null);
        setIsConnected(false);
      });
    }
  }, [client]);

  const subscribe = useCallback((topic: string | string[], callback?: (err: Error | null, granted: ISubscriptionGrant) => void) => {
    if (client && isConnected) {
      client.subscribe(topic, { qos: 0 }, (err, granted) => {
        if (err) {
          console.error(`[MQTT] Failed to subscribe to ${topic}:`, err);
          if (callback) {
            const defaultGrant: ISubscriptionGrant = { 
              topic: '', 
              qos: 0 as QoS,
              // @ts-ignore - Add missing properties to match ISubscriptionGrant
              messageId: 0,
              // @ts-ignore
              _packet: { cmd: 'suback' }
            };
            callback(err, defaultGrant);
          }
        } else {
          console.log(`[MQTT] Subscribed to ${topic}`, granted);
          if (callback) {
            const grant = Array.isArray(granted) && granted.length > 0 ? 
              granted[0] : 
              { 
                topic: '', 
                qos: 0 as QoS,
                // @ts-ignore - Add missing properties to match ISubscriptionGrant
                messageId: 0,
                // @ts-ignore
                _packet: { cmd: 'suback' }
              };
            callback(null, grant);
          }
        }
      });
    } else if (callback) {
      const defaultGrant: ISubscriptionGrant = { 
        topic: '', 
        qos: 0 as QoS,
        // @ts-ignore - Add missing properties to match ISubscriptionGrant
        messageId: 0,
        // @ts-ignore
        _packet: { cmd: 'suback' }
      };
      callback(new Error('MQTT client not connected'), defaultGrant);
    }
  }, [client, isConnected]);

  const unsubscribe = useCallback((topic: string | string[], callback?: (error?: Error) => void) => {
    if (client && isConnected) {
      client.unsubscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Failed to unsubscribe from ${topic}:`, err);
          if (callback) callback(err);
        } else {
          console.log(`[MQTT] Unsubscribed from ${topic}`);
          if (callback) callback();
        }
      });
    } else if (callback) {
      callback(new Error('MQTT client not connected'));
    }
  }, [client, isConnected]);

  const publish = useCallback((topic: string, message: string, options?: mqtt.IClientPublishOptions) => {
    if (client && isConnected) {
      return new Promise<void>((resolve, reject) => {
        client.publish(topic, message, { qos: 0, ...options }, (err) => {
          if (err) {
            console.error(`[MQTT] Failed to publish to ${topic}:`, err);
            reject(err);
          } else {
            console.log(`[MQTT] Published to ${topic}: ${message}`);
            resolve();
          }
        });
      });
    }
    return Promise.reject(new Error('MQTT client not connected'));
  }, [client, isConnected]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    client,
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    messages,
    activeDevices,
    setActiveDevices,
    error,
    clearError,
  }), [
    client,
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    messages,
    activeDevices,
    error,
    clearError
  ]);

  return (
    <MqttContext.Provider value={value}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = (): MqttContextType => {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt must be used within an MqttProvider');
  }
  return context;
};
