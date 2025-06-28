import React, { useState, useEffect } from 'react';
import { Device, CreateDeviceDto } from '@/types/device';

interface DeviceFormProps {
  device?: Device;
  onSubmit: (data: CreateDeviceDto) => void;
  onCancel: () => void;
}

export const DeviceForm: React.FC<DeviceFormProps> = ({ device, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateDeviceDto>({
    name: '',
    mqttServer: '',
    port: 1883,
    deviceType: 'energy',
    pricePerKwh: 0,
    pricePerCubicMeter: 0,
  });

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        mqttServer: device.mqttServer,
        port: device.port,
        deviceType: device.deviceType,
        pricePerKwh: device.pricePerKwh || 0,
        pricePerCubicMeter: device.pricePerCubicMeter || 0,
      });
    }
  }, [device]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.mqttServer || !formData.port) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.deviceType === 'energy' && formData.pricePerKwh === undefined) {
      alert('Please enter price per kWh for energy meter');
      return;
    }

    if (formData.deviceType === 'water' && formData.pricePerCubicMeter === undefined) {
      alert('Please enter price per m³ for water meter');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Device Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">MQTT Server *</label>
          <input
            type="text"
            name="mqttServer"
            value={formData.mqttServer}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="mqtt.example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Port *</label>
          <input
            type="number"
            name="port"
            value={formData.port}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Device Type *</label>
        <select
          name="deviceType"
          value={formData.deviceType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="energy">Energy Meter</option>
          <option value="water">Water Meter</option>
        </select>
      </div>

      {formData.deviceType === 'energy' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Price per kWh (IDR) *</label>
          <input
            type="number"
            name="pricePerKwh"
            value={formData.pricePerKwh}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      )}

      {formData.deviceType === 'water' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Price per m³ (IDR) *</label>
          <input
            type="number"
            name="pricePerCubicMeter"
            value={formData.pricePerCubicMeter}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {device ? 'Update' : 'Add'} Device
        </button>
      </div>
    </form>
  );
};
