import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MqttProvider } from './contexts/MqttContext';
import App from './App';
import './index.css';

// Import MQTT client (this will be used by the MQTT context)
import 'mqtt/dist/mqtt.min';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MqttProvider>
        <App />
      </MqttProvider>
    </BrowserRouter>
  </React.StrictMode>
);
