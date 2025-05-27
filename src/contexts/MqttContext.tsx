import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

interface MqttContextType {
  client: MqttClient | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: string, options?: mqtt.IClientPublishOptions) => void;
  messages: Record<string, string>;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Record<string, string>>({});

  const connect = useCallback(() => {
    try {
      console.log('[MQTT] Mencoba terhubung ke broker...');
      
      const options: IClientOptions = {
        clientId: 'modul-belajar-dashboard-' + Math.random().toString(16).substr(2, 8),
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

      const mqttClient = mqtt.connect('ws://202.74.74.42:8084', options);

      // Event handlers
      mqttClient.on('connect', () => {
        console.log('[MQTT] Berhasil terhubung ke broker');
        setIsConnected(true);
        
        const topics = [
          'sensor/parking',
          'sensor/suhu',
          'sensor/kelembaban',
          'sensor/waterlevel',
          'relay/1',
          'relay/2',
          'relay/control'
        ];
        
        topics.forEach(topic => {
          mqttClient.subscribe(topic, { qos: 0 }, (err) => {
            if (err) {
              console.error(`[MQTT] Gagal subscribe ke ${topic}:`, err);
            } else {
              console.log(`[MQTT] Berhasil subscribe ke ${topic}`);
            }
          });
        });
      });

      mqttClient.on('error', (err) => {
        console.error('[MQTT] Error:', err);
        setIsConnected(false);
      });

      mqttClient.on('close', () => {
        console.log('[MQTT] Koneksi ditutup');
        setIsConnected(false);
      });

      mqttClient.on('offline', () => {
        console.log('[MQTT] Client offline');
        setIsConnected(false);
      });

      mqttClient.on('message', (topic: string, message: Buffer) => {
        const payload = message.toString();
        console.log(`[MQTT] Pesan diterima di ${topic}: ${payload}`);
        setMessages(prev => ({
          ...prev,
          [topic]: payload
        }));
      });

      setClient(mqttClient);
      return mqttClient;
    } catch (error) {
      console.error('Gagal terhubung ke broker MQTT:', error);
      setIsConnected(false);
      return null;
    }
  }, []);

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

  const subscribe = useCallback((topic: string) => {
    if (!client || !isConnected) {
      console.warn('[MQTT] Tidak dapat subscribe: klien tidak terhubung');
      return;
    }
    
    client.subscribe(topic, { qos: 0 }, (err) => {
      if (err) {
        console.error(`[MQTT] Gagal subscribe ke ${topic}:`, err);
      } else {
        console.log(`[MQTT] Berhasil subscribe ke ${topic}`);
      }
    });
  }, [client, isConnected]);

  const unsubscribe = useCallback((topic: string) => {
    if (!client || !isConnected) {
      console.warn('[MQTT] Tidak dapat unsubscribe: klien tidak terhubung');
      return;
    }
    
    client.unsubscribe(topic, (err) => {
      if (err) {
        console.error(`[MQTT] Gagal unsubscribe dari ${topic}:`, err);
      } else {
        console.log(`[MQTT] Berhasil unsubscribe dari ${topic}`);
      }
    });
  }, [client, isConnected]);

  const publish = useCallback((topic: string, message: string, options?: mqtt.IClientPublishOptions) => {
    if (client && isConnected) {
      client.publish(topic, message, options || {});
      console.log(`[MQTT] Berhasil publish ke ${topic}: ${message}`);
      return true;
    } else {
      console.warn('[MQTT] Cannot publish - not connected');
      return false;
    }
  }, [client, isConnected]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (client) {
        console.log('[MQTT] Membersihkan koneksi...');
        client.end(true, undefined, () => {
          console.log('[MQTT] Koneksi dibersihkan');
        });
      }
    };
  }, [client]);

  // Buat value object yang stabil untuk mencegah re-render yang tidak perlu
  const contextValue = useMemo(() => ({
    client,
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    messages,
  }), [
    client,
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    messages,
  ]);

  return (
    <MqttContext.Provider value={contextValue}>
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
