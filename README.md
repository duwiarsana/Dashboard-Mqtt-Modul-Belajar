# MQTT Dashboard

A professional, clean, and responsive dashboard for monitoring and controlling IoT devices via MQTT. Features dark mode, real-time updates, and an intuitive user interface.

![Dashboard Preview](public/dashboard-preview.png)

## Features

- 📊 Real-time MQTT data visualization
- 🌓 Dark/Light mode toggle
- 🚦 Parking status monitoring
- 🌡️ Temperature and humidity sensors
- 💧 Water tank level monitoring
- 🔌 Relay control (3 channels)
- 📱 Responsive design
- 🚀 Fast and lightweight

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MQTT broker (e.g., Mosquitto, HiveMQ, etc.)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/duwiarsana/Dashboard-Mqtt-Modul-Belajar.git
   cd Dashboard-Mqtt-Modul-Belajar
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

1. Update the MQTT broker settings in `src/config/mqtt.ts`:
   ```typescript
   const MQTT_CONFIG = {
     url: 'ws://your-mqtt-broker:8080/mqtt',
     options: {
       username: 'your-username',
       password: 'your-password',
     },
     topics: {
       // Update topics as needed
     },
   };

## Nginx Reverse Proxy Example

If you want to access the dashboard from the internet, you can use Nginx as a reverse proxy. Example for port 8080:

```nginx
server {
    listen 8080;
    server_name iot.pkc.pub 41.216.191.200;

    location / {
        proxy_pass http://localhost:30080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

**Note:**
- If your ISP blocks port 80, use port 8080 and access the dashboard via `http://iot.pkc.pub:8080` or `http://41.216.191.200:8080`.
- DNS cannot point to a specific port. Always specify the port in the URL if not using port 80.

   ```

2. Customize the dashboard by modifying the components in the `src/components` directory.

## Running the App

```bash
# Development mode
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## Environment Variables

Create a `.env` file in the root directory to set environment variables:

```env
VITE_MQTT_URL=ws://your-mqtt-broker:8080/mqtt
VITE_MQTT_USERNAME=your-username
VITE_MQTT_PASSWORD=your-password
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/           # React contexts
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Technologies & UI Plugins Used

- **React 18** — UI library utama untuk membangun dashboard.
- **TypeScript** — Supaya code lebih aman dan maintainable.
- **Tailwind CSS** — Framework utility-first CSS untuk tampilan responsif, modern, dan mudah dikustomisasi.
- **@tailwindcss/forms & typography** — Plugin Tailwind untuk mempercantik tampilan form dan teks.
- **clsx & class-variance-authority** — Untuk mengelola class CSS dinamis dengan mudah.
- **Framer Motion** — Animasi UI yang halus dan interaktif.
- **@headlessui/react** — Komponen UI siap pakai yang mudah dikustomisasi dan tetap accessible.
- **Hero Icons** — Icon SVG gratis yang modern, digunakan untuk berbagai status, tombol, dsb.
- **Lucide React** — Icon SVG modern lain untuk variasi visual.
- **@radix-ui/react-progress & slot** — Komponen progres bar dan utilitas slot untuk UI modular.
- **Recharts** — Grafik interaktif dan responsif.
- **MQTT.js** — Library koneksi MQTT dari browser.
- **Vite** — Build tool modern untuk pengembangan super cepat.

### Font & Styling
- **Inter** — Google Fonts untuk tampilan teks bersih dan profesional.
- **Dark mode** — Didukung penuh, otomatis mengikuti preferensi sistem.

### Kenapa UI-nya Responsif & Ikonik?
- **Tailwind CSS** + plugin forms/typography membuat layout responsif, mobile-first, dan konsisten di berbagai device.
- **Hero Icons & Lucide** menyediakan icon SVG yang tajam, ringan, dan mudah diganti warnanya.
- **Framer Motion** menambah animasi transisi yang smooth.
- **@headlessui/react** membantu membuat komponen seperti switch, modal, dsb yang tetap accessible.

Lihat daftar dependensi lengkap di `package.json` untuk library lain yang digunakan.

## License

MIT

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Hero Icons](https://heroicons.com/)
- [MQTT.js](https://github.com/mqttjs/MQTT.js/)
- [Vite](https://vitejs.dev/)
