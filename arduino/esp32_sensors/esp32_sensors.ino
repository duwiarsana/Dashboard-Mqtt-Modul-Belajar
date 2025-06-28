#include <WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>

// PZEM Serial Pins
#define RXD2 17  // Connect to TX of PZEM
#define TXD2 16  // Connect to RX of PZEM

// Relay Pin
#define RELAY_PIN 25

// WiFi credentials
const char* ssid = "STARLINK";
const char* password = "";

// MQTT Broker settings
const char* mqtt_server = "202.74.74.42";
const int mqtt_port = 1883;
const char* mqtt_user = "";
const char* mqtt_password = "";

// MQTT Topics
const char* voltage_topic = "kost/kamar01/voltage";
const char* current_topic = "kost/kamar01/current";
const char* power_topic = "kost/kamar01/power";
const char* energy_topic = "kost/kamar01/energy";
const char* pf_topic = "kost/kamar01/power_factor";
const char* relay_topic = "kost/kamar01/relay/control";

// PZEM Object
PZEM004Tv30 pzem(Serial2, RXD2, TXD2);

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE 50
char msg[MSG_BUFFER_SIZE];

void setup_wifi() {
  delay(10);
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
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  // Check if the message is for relay control
  if (String(topic) == relay_topic) {
    if (message == "ON") {
      digitalWrite(RELAY_PIN, HIGH);
      Serial.println("Relay ON");
    } else if (message == "OFF") {
      digitalWrite(RELAY_PIN, LOW);
      Serial.println("Relay OFF");
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_password)) {
      Serial.println("connected");
      client.subscribe(relay_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  
  // Setup relay pin
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);  // Start with relay off
  
  // Initialize Serial2 for PZEM
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  float pf = pzem.pf();

  if (isnan(voltage)) {
    Serial.println("Error reading voltage");
  } else if (isnan(current)) {
    Serial.println("Error reading current");
  } else if (isnan(power)) {
    Serial.println("Error reading power");
  } else if (isnan(energy)) {
    Serial.println("Error reading energy");
  } else if (isnan(pf)) {
    Serial.println("Error reading power factor");
  }

  if (millis() - lastMsg > 2000) {
    lastMsg = millis();
   
    // Publish voltage
    snprintf(msg, MSG_BUFFER_SIZE, "%.1f", voltage);
    client.publish(voltage_topic, msg);
    
    // Publish current
    snprintf(msg, MSG_BUFFER_SIZE, "%.2f", current);
    client.publish(current_topic, msg);
    
    // Publish power
    snprintf(msg, MSG_BUFFER_SIZE, "%.1f", power);
    client.publish(power_topic, msg);
    
    // Publish energy
    snprintf(msg, MSG_BUFFER_SIZE, "%.3f", energy);
    client.publish(energy_topic, msg);
    
    // Publish power factor
    snprintf(msg, MSG_BUFFER_SIZE, "%.1f", pf);
    client.publish(pf_topic, msg);
    
    // Print to Serial for debugging
    Serial.print("Voltage: "); Serial.print(voltage); Serial.println("V");
    Serial.print("Current: "); Serial.print(current); Serial.println("A");
    Serial.print("Power: "); Serial.print(power); Serial.println("W");
    Serial.print("Energy: "); Serial.print(energy, 3); Serial.println("kWh");
    Serial.print("PF: "); Serial.println(pf);
  }
}
