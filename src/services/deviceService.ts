import { Device, CreateDeviceDto } from '@/types/device';

const DEVICE_STORAGE_KEY = 'mqtt_devices';

export const getDevices = (): Device[] => {
  if (typeof window === 'undefined') return [];
  const devices = localStorage.getItem(DEVICE_STORAGE_KEY);
  return devices ? JSON.parse(devices) : [];
};

export const getDevice = (id: string): Device | undefined => {
  const devices = getDevices();
  return devices.find(device => device.id === id);
};

export const createDevice = (data: CreateDeviceDto): Device => {
  const devices = getDevices();
  const deviceId = `device_${Date.now()}`;
  const topics = generateTopics(deviceId, data.deviceType);
  
  const newDevice: Device = {
    ...data,
    id: deviceId,
    topics,
    isActive: false,
    createdAt: new Date(),
  };

  const updatedDevices = [...devices, newDevice];
  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(updatedDevices));
  return newDevice;
};

export const updateDevice = (id: string, data: Partial<Device>): Device | null => {
  const devices = getDevices();
  const deviceIndex = devices.findIndex(d => d.id === id);
  
  if (deviceIndex === -1) return null;

  const updatedDevice = {
    ...devices[deviceIndex],
    ...data,
    id, // Prevent ID change
  };

  const updatedDevices = [...devices];
  updatedDevices[deviceIndex] = updatedDevice;
  
  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(updatedDevices));
  return updatedDevice;
};

export const deleteDevice = (id: string): boolean => {
  const devices = getDevices();
  const updatedDevices = devices.filter(device => device.id !== id);
  
  if (updatedDevices.length === devices.length) return false;
  
  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(updatedDevices));
  return true;
};

const generateTopics = (deviceId: string, type: 'energy' | 'water'): string[] => {
  if (type === 'energy') {
    return [
      `${deviceId}/voltage`,
      `${deviceId}/current`,
      `${deviceId}/power`,
      `${deviceId}/energy`,
      `${deviceId}/pf`,
    ];
  } else {
    return [
      `${deviceId}/flow`,
      `${deviceId}/volume`,
    ];
  }
};
