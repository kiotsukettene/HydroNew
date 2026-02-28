import mqtt, { MqttClient } from 'mqtt';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

const MQTT_BROKER = 'wss://960858f8c9cd49548edc44f8b9fac4e9.s1.eu.hivemq.cloud:8884/mqtt';
const MQTT_USER = 'Biotech';
const MQTT_PASS = 'Momorevillame24';

let client: MqttClient | null = null;
let currentClientId: string | null = null;
let isConnected = false;
const onConnectCallbacks = new Set<() => void>();

/**
 * Connect MQTT with clientId based on logged-in user.
 * Call when user is authenticated. Reconnects if userId changes.
 * Fixes "Missing clientId for unclean clients" with clean: false.
 */
export function connectWithClientId(userId: string): void {
  const clientId = `hydronew_${userId}`;
  if (client && currentClientId === clientId) return;

  if (client && currentClientId !== clientId) {
    console.log('[MQTT] User changed, reconnecting with new clientId');
    client.end(true);
    client = null;
    currentClientId = null;
    messageListenerAttached = false; // Re-attach listener to new client
  }

  console.log('[MQTT] Connecting with clientId:', clientId);
  isConnected = false;
  client = mqtt.connect(MQTT_BROKER, {
    clientId,
    username: MQTT_USER,
    password: MQTT_PASS,
    protocol: 'wss',
    reconnectPeriod: 2000,
    connectTimeout: 30000,
    keepalive: 30, // Send ping every 30s so broker doesn't close for idle
    clean: false, // Persistent session - broker retains subscriptions & delivers queued messages after reconnect
  });
  currentClientId = clientId;

  client.on('connect', () => {
    if (isConnected) return; // Already connected, ignore duplicate connect event
    isConnected = true;
    console.log('MQTT connected');

    subscribedTopics.forEach((qos, topic) => {
      console.log(`[MQTT] Resubscribing to ${topic} with QoS ${qos}`);
      client!.subscribe(topic, { qos });
    });

    onConnectCallbacks.forEach((cb) => {
      try { cb(); } catch (e) { console.error('[MQTT] onConnect callback error:', e); }
    });
  });

  client.on('close', () => {
    isConnected = false;
  });

  client.on('offline', () => {
    isConnected = false;
  });

  client.on('error', (err) => console.log('MQTT error:', err));
}

/**
 * Register a callback to be invoked when MQTT connects or reconnects.
 */
export function onMQTTConnect(callback: () => void): () => void {
  onConnectCallbacks.add(callback);
  return () => onConnectCallbacks.delete(callback);
}

export function getMQTTClient(): MqttClient | null {
  return client;
}

// PUBLISH LOGIC

/**
 * Publish a message to a topic.
 */
export function publishMessage(topic: string, message: string, qos: 0|1|2 = 1) {
  const c = getMQTTClient();
  if (c) c.publish(topic, message, { qos, retain: false });
}

/**
 * Publish a message and invoke callback when ack is received on topic/ack.
 * Ack "1" = success, "0" or other = error.
 */
export function publishWithAck(
  topic: string,
  message: string,
  onAck: (success: boolean) => void,
  qos: 0|1|2 = 1
) {
  const ackTopic = `${topic}/ack`;
  const existing = pendingAckCallbacks.get(ackTopic);
  if (existing) existing.callbacks.push(onAck);
  else {
    pendingAckCallbacks.set(ackTopic, { callbacks: [onAck] });
    ensureAckHandler(ackTopic);
  }
  const c = getMQTTClient();
  if (c) c.publish(topic, message, { qos, retain: false });
}

const pendingAckCallbacks = new Map<string, { callbacks: ((success: boolean) => void)[] }>();
const ackHandlersRegistered = new Set<string>();

function ensureAckHandler(ackTopic: string) {
  if (ackHandlersRegistered.has(ackTopic)) return;
  ackHandlersRegistered.add(ackTopic);
  subscribeMessage(ackTopic, (_topic, payload) => {
    const pending = pendingAckCallbacks.get(ackTopic);
    if (!pending || pending.callbacks.length === 0) return;
    const value = payload.toString().trim();
    const success = value === '1';
    const callbacks = pending.callbacks.splice(0);
    pendingAckCallbacks.delete(ackTopic);
    callbacks.forEach((cb) => {
      try { cb(success); } catch (e) { console.error('publishWithAck callback error:', e); }
    });
  });
}

// SUBCRIBE LOGIC

type MessageHandler = (topic: string, message: Buffer) => void;

const topicHandlers = new Map<string, Set<MessageHandler>>();
const subscribedTopics = new Map<string, 0 | 1 | 2>(); // Store topic with its QoS level
let messageListenerAttached = false;

function ensureMessageListener() {
  if (messageListenerAttached) return;

  const mqttClient = getMQTTClient();
  if (!mqttClient) return;

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
  if (!mqttClient) return () => {}; // No-op when not connected

  ensureMessageListener();

  if (!topicHandlers.has(topic)) {
    topicHandlers.set(topic, new Set());
  }

  topicHandlers.get(topic)!.add(handler);

  if (!subscribedTopics.has(topic)) {
    subscribedTopics.set(topic, qos);
    // Only call subscribe when client is connected; otherwise the 'connect' handler will resubscribe from subscribedTopics
    if (mqttClient.connected) {
      console.log(`[MQTT] Subscribing to ${topic} with QoS ${qos}`);
      mqttClient.subscribe(topic, { qos }, (err) => {
        if (err) {
          console.error(`[MQTT] Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`[MQTT] Successfully subscribed to ${topic} with QoS ${qos}`);
        }
      });
    }
  }

  // optional cleanup (use in useEffect return)
  return () => {
    const handlers = topicHandlers.get(topic);
    if (!handlers) return;

    handlers.delete(handler);

    if (handlers.size === 0) {
      console.log(`[MQTT] Unsubscribing from ${topic}`);
      mqttClient.unsubscribe(topic);
      subscribedTopics.delete(topic);
      topicHandlers.delete(topic);
    }
  };
}