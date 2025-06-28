import React, { useState, useEffect } from 'react';
import { useMqtt } from '@/contexts/MqttContext';
import { Device, CreateDeviceDto } from '@/types/device';
import { getDevices, createDevice, updateDevice, deleteDevice } from '@/services/deviceService';
import { DeviceForm } from '@/components/DeviceForm';

const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const { subscribe, unsubscribe } = useMqtt();

  // Load devices from local storage on component mount
  useEffect(() => {
    const loadedDevices = getDevices();
    setDevices(loadedDevices);
  }, []);

  // Handle form submission
  const handleSubmit = (data: CreateDeviceDto) => {
    try {
      if (editingDevice) {
        // Update existing device
        const updatedDevice = updateDevice(editingDevice.id, data);
        if (updatedDevice) {
          setDevices(devices.map(d => d.id === updatedDevice.id ? updatedDevice : d));
        }
      } else {
        // Create new device
        const newDevice = createDevice(data);
        setDevices([...devices, newDevice]);
      }
      setIsFormOpen(false);
      setEditingDevice(null);
    } catch (error) {
      console.error('Error saving device:', error);
      alert('Failed to save device');
    }
  };

  // Handle device deletion
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      const success = deleteDevice(id);
      if (success) {
        setDevices(devices.filter(device => device.id !== id));
      }
    }
  };

  // Toggle device active status
  const toggleDeviceStatus = (device: Device) => {
    const updatedDevice = { ...device, isActive: !device.isActive };
    const success = updateDevice(device.id, updatedDevice);
    if (success) {
      setDevices(devices.map(d => d.id === device.id ? updatedDevice : d));
      
      // Subscribe/unsubscribe based on new status
      if (updatedDevice.isActive) {
        subscribe(device.topics, (err) => {
          if (err) {
            console.error(`Failed to subscribe to device ${device.id} topics:`, err);
          }
        });
      } else {
        unsubscribe(device.topics, (err) => {
          if (err) {
            console.error(`Failed to unsubscribe from device ${device.id} topics:`, err);
          }
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Device Management</h1>
        <button
          onClick={() => {
            setEditingDevice(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Device
        </button>
      </div>

      {/* Device List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MQTT Server
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No devices found. Add your first device to get started.
                </td>
              </tr>
            ) : (
              devices.map((device) => (
                <tr key={device.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {device.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.deviceType === 'energy' ? 'Energy Meter' : 'Water Meter'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.mqttServer}:{device.port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        device.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {device.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleDeviceStatus(device)}
                      className={`mr-2 ${
                        device.isActive
                          ? 'text-yellow-600 hover:text-yellow-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {device.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingDevice(device);
                        setIsFormOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(device.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Device Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingDevice ? 'Edit Device' : 'Add New Device'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingDevice(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <DeviceForm
              device={editingDevice || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingDevice(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
