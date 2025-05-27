# ESP32 Sensor Hub with MQTT

This project implements a sensor hub using ESP32 that collects data from various sensors and publishes them to an MQTT broker. The system includes ultrasonic distance measurement, water level monitoring, temperature/humidity sensing, and light level detection.

## Features

- **Ultrasonic Sensor (HC-SR04)**
  - Measures distance using sound waves
  - Triggers when an object is within 25cm
  - GPIO: TRIG=16, ECHO=17

- **Water Level Sensor (Potentiometer)**
  - Measures water level using a potentiometer
  - Outputs value from 0-100%
  - GPIO: 34 (Analog Input)

- **DHT11 Temperature & Humidity Sensor**
  - Measures ambient temperature and humidity
  - GPIO: 4

- **Light Sensor (LDR)**
  - Measures ambient light levels
  - Controls relay based on light threshold
  - GPIO: 35 (Analog Input)

- **Relay Control**
  - Single relay output
  - Controlled by light sensor
  - GPIO: 25

## MQTT Topics

The ESP32 publishes to the following MQTT topics:

- `sensor/parking` - "true" if object <25cm, "false" otherwise
- `sensor/waterlevel` - Water level percentage (0-100)
- `sensor/suhu` - Temperature in °C
- `sensor/kelembaban` - Humidity in %
- `relay/1` - Relay status (ON/OFF)

## Hardware Requirements

- ESP32 development board
- HC-SR04 Ultrasonic Sensor
- DHT11 Temperature & Humidity Sensor
- Potentiometer (for water level simulation)
- Light Dependent Resistor (LDR) with 10KΩ resistor
- Relay module
- Jumper wires
- Breadboard

## Wiring

| ESP32 Pin | Component | Connection |
|-----------|-----------|------------|
| GPIO16    | HC-SR04   | TRIG       |
| GPIO17    | HC-SR04   | ECHO       |
| GPIO34    | Potentiometer | Middle Pin |
| GPIO4     | DHT11     | Data       |
| GPIO35    | LDR       | Middle of voltage divider |
| GPIO25    | Relay     | IN         |


## Dependencies

1. **Arduino IDE**
   - Install from [arduino.cc](https://www.arduino.cc/en/software)

2. **ESP32 Board Support**
   - Add ESP32 board URL: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Install "ESP32" board package

3. **Required Libraries**
   - PubSubClient by Nick O'Leary
   - DHT sensor library by Adafruit
   - Adafruit Unified Sensor (dependency for DHT library)

## Installation

1. Clone this repository
2. Open `esp32_sensors.ino` in Arduino IDE
3. Update the following in the code:
   - `ssid` - Your WiFi SSID
   - `password` - Your WiFi password
   - `mqtt_server` - Your MQTT broker address
   - `mqtt_user` and `mqtt_password` - If your broker requires authentication

4. Select the correct board:
   - Board: "ESP32 Dev Module"
   - Upload Speed: "921600"
   - Port: Select the correct COM port

5. Upload the sketch to your ESP32

## Serial Monitor

Open the Serial Monitor (115200 baud) to view debug information:
- Connection status
- Sensor readings
- MQTT connection status

## Relay Control

The relay is automatically controlled by the light sensor:
- Turns ON when light level is below threshold (2000)
- Turns OFF when light level is above threshold
- The threshold can be adjusted in the code

## Troubleshooting

1. **WiFi Connection Issues**
   - Verify SSID and password
   - Check if your network is 2.4GHz (ESP32 doesn't support 5GHz)

2. **MQTT Connection Issues**
   - Verify MQTT broker address and port
   - Check if broker requires authentication
   - Ensure your network allows MQTT traffic (port 1883)

3. **Sensor Issues**
   - Verify wiring connections
   - Check power supply (3.3V for ESP32)
   - Ensure proper pull-up resistors if needed

## License

This project is open source and available under the MIT License.
