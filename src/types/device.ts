export interface Device {
  id: string;
  name: string;
  mqttServer: string;
  port: number;
  deviceType: 'energy' | 'water';
  pricePerKwh?: number;
  pricePerCubicMeter?: number;
  topics: string[];
  isActive: boolean;
  createdAt: Date;
}

export type CreateDeviceDto = Omit<Device, 'id' | 'createdAt' | 'isActive' | 'topics'>;
