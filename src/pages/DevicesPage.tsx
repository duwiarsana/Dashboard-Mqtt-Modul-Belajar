import React, { useState, useEffect } from 'react';
import { Device } from '@/types/device';
import { getDevices, deleteDevice } from '@/services/deviceService';
import { DeviceForm } from '@/components/DeviceForm';
import { useMqtt } from '@/contexts/MqttContext';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const { client, subscribe, unsubscribe } = useMqtt();

  const loadDevices = () => {
    const loadedDevices = getDevices();
    setDevices(loadedDevices);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    // Subscribe to topics for all active devices
    devices.forEach(device => {
      if (device.isActive && client?.connected) {
        device.topics.forEach(topic => {
          subscribe(topic);
        });
      }
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (client) {
        devices.forEach(device => {
          device.topics.forEach(topic => {
            unsubscribe(topic);
          });
        });
      }
    };
  }, [client, devices]);

  const handleAddClick = () => {
    setEditingDevice(null);
    setShowForm(true);
  };

  const handleEditClick = (device: Device) => {
    setEditingDevice(device);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      const success = deleteDevice(id);
      if (success) {
        loadDevices();
      }
    }
  };

  const handleFormSuccess = () => {
    loadDevices();
    setShowForm(false);
    setEditingDevice(null);
  };

  const toggleDeviceStatus = (device: Device) => {
    const updatedDevice = { ...device, isActive: !device.isActive };
    const updatedDevices = devices.map(d => 
      d.id === device.id ? updatedDevice : d
    );
    setDevices(updatedDevices);
    
    // Update in local storage
    const storageDevices = getDevices();
    const deviceIndex = storageDevices.findIndex(d => d.id === device.id);
    if (deviceIndex !== -1) {
      storageDevices[deviceIndex] = updatedDevice;
      localStorage.setItem('mqtt_devices', JSON.stringify(storageDevices));
    }

    // Subscribe/unsubscribe to topics based on new status
    if (updatedDevice.isActive) {
      updatedDevice.topics.forEach(topic => subscribe(topic));
    } else {
      updatedDevice.topics.forEach(topic => unsubscribe(topic));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your MQTT devices and their configurations
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add device
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-8 bg-white shadow sm:rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingDevice ? 'Edit Device' : 'Add New Device'}
          </h2>
          <DeviceForm
            device={editingDevice || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingDevice(null);
            }}
          />
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      MQTT Server
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {devices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        No devices found. Add your first device to get started.
                      </td>
                    </tr>
                  ) : (
                    devices.map((device) => (
                      <tr key={device.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {device.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {device.deviceType === 'energy' ? 'Energy Meter' : 'Water Meter'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {device.mqttServer}:{device.port}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              device.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {device.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => toggleDeviceStatus(device)}
                            className={`mr-3 ${
                              device.isActive
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {device.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleEditClick(device)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(device.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicesPage;
