#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "STARLINK";
const char* password = "";

// MQTT Broker settings
const char* mqtt_server = "202.74.74.42";
const int mqtt_port = 1883;
const char* mqtt_user = "";
const char* mqtt_password = "";

// MQTT Topics - Match with web app
const char* parking_topic = "sensor/parking";
const char* temperature_topic = "sensor/suhu";
const char* humidity_topic = "sensor/kelembaban";
const char* water_level_topic = "sensor/waterlevel";
const char* light_topic = "sensor/cahaya";
const char* relay_topic = "relay/1";

// Sensor calibration
const int LIGHT_MIN = 0;    // Nilai minimum dari sensor cahaya (gelap)
const int LIGHT_MAX = 4095;   // Nilai maksimum dari sensor cahaya (terang)
const int WATER_EMPTY = 0;    // Nilai ADC saat tangki kosong (0-4095)
const int WATER_FULL = 4095;   // Nilai ADC saat tangki penuh (0-4095)
const int SMOOTHING_READINGS = 5; // Jumlah pembacaan untuk smoothing

// Pin Definitions
#define TRIG_PIN 16
#define ECHO_PIN 17
#define RELAY_PIN 25
#define DHT_PIN 4
#define LIGHT_SENSOR_PIN 35
#define POTENTIOMETER_PIN 34

// DHT Sensor Setup
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

// Variables
unsigned long lastMsg = 0;
const long interval = 2000; // Update interval in milliseconds
bool relayState = false; // Menyimpan state relay

// Variabel untuk menyimpan nilai sebelumnya
float prevDistance = -1;
int prevWaterLevel = -1;
float prevTemperature = -100;
float prevHumidity = -1;
int prevLightPercent = -1;

WiFiClient espClient;
PubSubClient client(espClient);

// Callback function when MQTT message is received
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on [");
  Serial.print(topic);
  Serial.print("]: ");
  
  // Convert payload to string
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  // Only process relay commands if the topic matches
  if (String(topic) == relay_topic) {
    if (message == "ON") {
      digitalWrite(RELAY_PIN, HIGH);
      relayState = true;
      Serial.println("Relay turned ON by command");
    } else if (message == "OFF") {
      digitalWrite(RELAY_PIN, LOW);
      relayState = false;
      Serial.println("Relay turned OFF by command");
    }
  }
}

void setup_wifi() {
  delay(10);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection... ");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {  // Removed user/pass if not needed
      Serial.println("connected");
      // Only subscribe to the relay topic, no other subscriptions
      if (client.subscribe(relay_topic)) {
        Serial.print("Subscribed to: ");
        Serial.println(relay_topic);
      } else {
        Serial.println("Failed to subscribe to relay topic");
      }
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);  // Ensure relay starts in OFF state
  pinMode(LIGHT_SENSOR_PIN, INPUT);
  pinMode(POTENTIOMETER_PIN, INPUT);
  
  Serial.println("Initialized all pins");
  
  // Initialize DHT sensor
  dht.begin();
  
  // Initialize WiFi and MQTT
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);  // Set callback function
}

float readDistance() {
  // Clear the TRIG_PIN
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // Sets the TRIG_PIN on HIGH state for 10 micro seconds
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Reads the ECHO_PIN, returns the sound wave travel time in microseconds
  long duration = pulseIn(ECHO_PIN, HIGH);
  
  // Calculate the distance in centimeters
  float distance = duration * 0.034 / 2;
  
  return distance;
}

// Array untuk smoothing
int waterLevelReadings[SMOOTHING_READINGS];
int readIndex = 0;
int total = 0;

int readWaterLevel() {
  // Baca nilai analog
  int sensorValue = analogRead(POTENTIOMETER_PIN);
  
  // Update total untuk moving average
  total = total - waterLevelReadings[readIndex];
  waterLevelReadings[readIndex] = sensorValue;
  total = total + waterLevelReadings[readIndex];
  readIndex = (readIndex + 1) % SMOOTHING_READINGS;
  
  // Hitung rata-rata
  int averageReading = total / SMOOTHING_READINGS;
  
  // Map ke persentase (dibalik karena semakin tinggi sensor = semakin rendah air)
  int level = map(averageReading, WATER_EMPTY, WATER_FULL, 100, 0);
  
  // Beri batas 0-100%
  level = constrain(level, 0, 100);
  
  // Debug output
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint > 1000) { // Cetak setiap 1 detik saja
    lastPrint = millis();
    Serial.print("Water Level - Raw: ");
    Serial.print(sensorValue);
    Serial.print(" | Avg: ");
    Serial.print(averageReading);
    Serial.print(" | Level: ");
    Serial.print(level);
    Serial.println("%");
  }
  
  return level;
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;
    
    // Read sensors
    float distance = readDistance();
    int waterLevel = readWaterLevel();
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int lightValue = analogRead(LIGHT_SENSOR_PIN);
    
    // Check if distance is less than 25cm
    bool objectDetected = (distance < 20 && distance > 0);
    
    // Map light sensor value to 0-100% (0% = gelap, 100% = terang)
    int lightPercent = map(lightValue, LIGHT_MIN, LIGHT_MAX, 0, 100);
    lightPercent = constrain(lightPercent, 0, 100);  // Pastikan nilai antara 0-100
    
    // Hanya publish jika ada perubahan dari nilai sebelumnya
    if (objectDetected != (prevDistance < 20 && prevDistance > 0)) {
      client.publish(parking_topic, objectDetected ? "true" : "false");
    }
    
    if (waterLevel != prevWaterLevel) {
      client.publish(water_level_topic, String(waterLevel).c_str());
      prevWaterLevel = waterLevel;
    }
    
    if (abs(temperature - prevTemperature) >= 0.1) {  // Hanya jika perubahan >= 0.1 derajat
      client.publish(temperature_topic, String(temperature, 1).c_str());
      prevTemperature = temperature;
    }
    
    if (abs(humidity - prevHumidity) >= 0.5) {  // Hanya jika perubahan >= 0.5%
      client.publish(humidity_topic, String(humidity, 1).c_str());
      prevHumidity = humidity;
    }
    
    if (lightPercent != prevLightPercent) {
      client.publish(light_topic, String(lightPercent).c_str());
      prevLightPercent = lightPercent;
    }
    
    // Simpan nilai distance terakhir
    prevDistance = distance;
    
    // Print values to Serial for debugging
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.print(" cm, Object Detected: ");
    Serial.println(objectDetected ? "Yes" : "No");
    
    Serial.print("Water Level: ");
    Serial.print(waterLevel);
    Serial.println(" %");
    
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C, Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
    
    Serial.print("Light Sensor: ");
    Serial.print(lightValue);
    Serial.print(" (");
    Serial.print(lightPercent);
    Serial.println("%)");
    Serial.println("----------------------");
  }
}
