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
  // Topik untuk setiap kamar (1-8)
  rooms: {
    1: {
      name: 'Kamar 01',
      topics: {
        voltage: 'pzem/voltage',
        current: 'pzem/current',
        power: 'pzem/power',
        powerFactor: 'pzem/pf',
        energy: 'pzem/energy',
        cost: 'pzem/cost',
        temperature: 'kost/kamar01/temperature',
        humidity: 'kost/kamar01/humidity',
        water: 'kost/kamar01/water',
        relay: 'kost/kamar01/relay/control',
        paymentStatus: 'kost/kamar01/payment/status'
      }
    },
    2: {
      name: 'Kamar 02',
      topics: {
        voltage: 'kost/kamar02/voltage',
        current: 'kost/kamar02/current',
        power: 'kost/kamar02/power',
        powerFactor: 'kost/kamar02/power_factor',
        energy: 'kost/kamar02/energy',
        cost: 'kost/kamar02/cost',
        temperature: 'kost/kamar02/temperature',
        humidity: 'kost/kamar02/humidity',
        water: 'kost/kamar02/water',
        relay: 'kost/kamar02/relay/control',
        paymentStatus: 'kost/kamar02/payment/status'
      }
    },
    3: {
      name: 'Kamar 03',
      topics: {
        voltage: 'kost/kamar03/voltage',
        current: 'kost/kamar03/current',
        power: 'kost/kamar03/power',
        powerFactor: 'kost/kamar03/power_factor',
        energy: 'kost/kamar03/energy',
        cost: 'kost/kamar03/cost',
        temperature: 'kost/kamar03/temperature',
        humidity: 'kost/kamar03/humidity',
        water: 'kost/kamar03/water',
        relay: 'kost/kamar03/relay/control',
        paymentStatus: 'kost/kamar03/payment/status'
      }
    },
    4: {
      name: 'Kamar 04',
      topics: {
        voltage: 'kost/kamar04/voltage',
        current: 'kost/kamar04/current',
        power: 'kost/kamar04/power',
        powerFactor: 'kost/kamar04/power_factor',
        energy: 'kost/kamar04/energy',
        cost: 'kost/kamar04/cost',
        temperature: 'kost/kamar04/temperature',
        humidity: 'kost/kamar04/humidity',
        water: 'kost/kamar04/water',
        relay: 'kost/kamar04/relay/control',
        paymentStatus: 'kost/kamar04/payment/status'
      }
    },
    5: {
      name: 'Kamar 05',
      topics: {
        voltage: 'kost/kamar05/voltage',
        current: 'kost/kamar05/current',
        power: 'kost/kamar05/power',
        powerFactor: 'kost/kamar05/power_factor',
        energy: 'kost/kamar05/energy',
        cost: 'kost/kamar05/cost',
        temperature: 'kost/kamar05/temperature',
        humidity: 'kost/kamar05/humidity',
        water: 'kost/kamar05/water',
        relay: 'kost/kamar05/relay/control',
        paymentStatus: 'kost/kamar05/payment/status'
      }
    },
    6: {
      name: 'Kamar 06',
      topics: {
        voltage: 'kost/kamar06/voltage',
        current: 'kost/kamar06/current',
        power: 'kost/kamar06/power',
        powerFactor: 'kost/kamar06/power_factor',
        energy: 'kost/kamar06/energy',
        cost: 'kost/kamar06/cost',
        temperature: 'kost/kamar06/temperature',
        humidity: 'kost/kamar06/humidity',
        water: 'kost/kamar06/water',
        relay: 'kost/kamar06/relay/control',
        paymentStatus: 'kost/kamar06/payment/status'
      }
    },
    7: {
      name: 'Kamar 07',
      topics: {
        voltage: 'kost/kamar07/voltage',
        current: 'kost/kamar07/current',
        power: 'kost/kamar07/power',
        powerFactor: 'kost/kamar07/power_factor',
        energy: 'kost/kamar07/energy',
        cost: 'kost/kamar07/cost',
        temperature: 'kost/kamar07/temperature',
        humidity: 'kost/kamar07/humidity',
        water: 'kost/kamar07/water',
        relay: 'kost/kamar07/relay/control',
        paymentStatus: 'kost/kamar07/payment/status'
      }
    },
    8: {
      name: 'Kamar 08',
      topics: {
        voltage: 'kost/kamar08/voltage',
        current: 'kost/kamar08/current',
        power: 'kost/kamar08/power',
        powerFactor: 'kost/kamar08/power_factor',
        energy: 'kost/kamar08/energy',
        cost: 'kost/kamar08/cost',
        temperature: 'kost/kamar08/temperature',
        humidity: 'kost/kamar08/humidity',
        water: 'kost/kamar08/water',
        relay: 'kost/kamar08/relay/control',
        paymentStatus: 'kost/kamar08/payment/status'
      }
    }
  },
};
