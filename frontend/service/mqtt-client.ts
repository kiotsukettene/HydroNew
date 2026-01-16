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

  client.on('connect', () => {
  console.log('MQTT connected');

  subscribedTopics.forEach(topic => {
    client!.subscribe(topic);
  });
});

  client.on('error', (err) => console.log('MQTT error:', err));

  return client;
}

// PUBLISH LOGIC

/**
 * Publish a message to a topic.
 */

export function publishMessage(topic: string, message: string, qos: 0|1|2 = 1) {
  getMQTTClient().publish(topic, message, { qos, retain: false });
}


// SUBCRIBE LOGIC

type MessageHandler = (topic: string, message: Buffer) => void;

const topicHandlers = new Map<string, Set<MessageHandler>>();
const subscribedTopics = new Set<string>();
let messageListenerAttached = false;

function ensureMessageListener() {
  if (messageListenerAttached) return;

  const mqttClient = getMQTTClient();

  mqttClient.on('message', (topic, payload) => {
    const handlers = topicHandlers.get(topic);
    if (!handlers) return;

    handlers.forEach(handler => {
      try {
        handler(topic, payload);
      } catch (err) {
        console.error('MQTT handler error:', err);
      }
    });
  });

  messageListenerAttached = true;
}

/**
 * Subscribe to a topic and receive messages.
 * Safe to call from multiple pages.
 */
export function subscribeMessage(
  topic: string,
  handler: MessageHandler,
  qos: 0 | 1 | 2 = 1
) {
  const mqttClient = getMQTTClient();
  ensureMessageListener();

  if (!topicHandlers.has(topic)) {
    topicHandlers.set(topic, new Set());
  }

  topicHandlers.get(topic)!.add(handler);

  if (!subscribedTopics.has(topic)) {
    mqttClient.subscribe(topic, { qos });
    subscribedTopics.add(topic);
  }

  // optional cleanup (use in useEffect return)
  return () => {
    const handlers = topicHandlers.get(topic);
    if (!handlers) return;

    handlers.delete(handler);

    if (handlers.size === 0) {
      mqttClient.unsubscribe(topic);
      subscribedTopics.delete(topic);
      topicHandlers.delete(topic);
    }
  };
}
