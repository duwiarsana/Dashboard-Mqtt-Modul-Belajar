import { IClientOptions } from 'mqtt';

// Konfigurasi MQTT yang disederhanakan
export const mqttConfig = {
  brokerUrl: 'ws://202.74.74.42:8084',
  options: {
    // Gunakan client ID yang tetap
    clientId: 'modul-belajar-dashboard',
    clean: true,
    protocol: 'ws' as const, // Gunakan 'ws' untuk koneksi tidak terenkripsi
    // Opsi WebSocket sederhana
    wsOptions: {
      rejectUnauthorized: false
    },
    // Callback untuk logging
    onConnect: () => console.log('[MQTT] Connected to broker'),
    onClose: () => console.log('[MQTT] Connection closed'),
    onError: (error: Error) => console.error('[MQTT] Error:', error.message),
    onReconnect: () => console.log('[MQTT] Reconnecting...'),
    onOffline: () => console.log('[MQTT] Client offline'),
    onEnd: () => console.log('[MQTT] Connection ended')
  } as IClientOptions,
  topics: {
    // Topik untuk ParkingStatus
    parking: 'sensor/parking',
    
    // Topik untuk EnvironmentSensors
    temperature: 'sensor/suhu',
    humidity: 'sensor/kelembaban',
    light: 'sensor/cahaya',
    
    // Topik untuk WaterTank
    waterLevel: 'sensor/waterlevel',
    
    // Topik untuk RelayControl
    relay1: 'relay/1',
    relay2: 'relay/2',
    relayControl: 'relay/control'
  },
};
