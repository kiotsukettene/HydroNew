import mqtt, { MqttClient } from 'mqtt';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

const MQTT_BROKER = 'wss://960858f8c9cd49548edc44f8b9fac4e9.s1.eu.hivemq.cloud:8884/mqtt';
const MQTT_USER = 'Biotech';
const MQTT_PASS = 'Momorevillame24';

let client: MqttClient | null = null;

export function getMQTTClient(): MqttClient {
  if (client) return client;

  client = mqtt.connect(MQTT_BROKER, {
    username: MQTT_USER,
    password: MQTT_PASS,
    protocol: 'wss',
    reconnectPeriod: 2000,
    connectTimeout: 30000
  });

  client.on('connect', () => console.log('MQTT connected'));
  client.on('reconnect', () => console.log('MQTT reconnecting...'));
  client.on('error', (err) => console.log('MQTT error:', err));

  return client;
}

export function publishMessage(topic: string, message: string, qos: 0|1|2 = 1) {
  getMQTTClient().publish(topic, message, { qos });
}
