import { StringeeClient } from "stringee-chat-js-sdk";

let stringeeClient = null;
let isInitialized = false;
const eventListeners = new Map();

export const initializeStringee = (token) => {
  if (isInitialized) {
    console.log("Stringee client already initialized");
    return stringeeClient;
  }

  stringeeClient = new StringeeClient([
    "wss://v1.stringee.com:6899/",
    "wss://v2.stringee.com:6899/",
  ]);

  // Register core events
  stringeeClient.on("connect", () => {
    console.log("✅ Connected to Stringee server");
    _isConnected = true;
    // Notify all registered connect listeners
    if (eventListeners.has("connect")) {
      eventListeners.get("connect").forEach((callback) => callback());
    }
  });

  stringeeClient.on("authen", (res) => {
    console.log("Authentication response:", res);
    if (res.r === 0) {
      _isConnected = true;
    } else {
      _isConnected = false;
    }
    // Notify all registered authen listeners
    if (eventListeners.has("authen")) {
      eventListeners.get("authen").forEach((callback) => callback(res));
    }
  });

  stringeeClient.on("disconnect", () => {
    console.log("⚠️ Disconnected from Stringee server");
    _isConnected = false;
    // Notify all registered disconnect listeners
    if (eventListeners.has("disconnect")) {
      eventListeners.get("disconnect").forEach((callback) => callback());
    }
  });

  stringeeClient.on("incomingcall", (incomingCall) => {
    console.log("📞 Incoming call:", incomingCall);
    // Notify all registered incomingcall listeners
    if (eventListeners.has("incomingcall")) {
      eventListeners
        .get("incomingcall")
        .forEach((callback) => callback(incomingCall));
    }
  });

  stringeeClient.on("otherdeviceauthen", () => {
    console.log("⚠️ Logged in from another device");
    // Notify all registered otherdeviceauthen listeners
    if (eventListeners.has("otherdeviceauthen")) {
      eventListeners.get("otherdeviceauthen").forEach((callback) => callback());
    }
  });

  stringeeClient.on("error", (error) => {
    console.error("❌ Stringee client error:", error);
    // Notify all registered error listeners
    if (eventListeners.has("error")) {
      eventListeners.get("error").forEach((callback) => callback(error));
    }
  });

  // Connect with token
  stringeeClient.connect(token);
  isInitialized = true;

  return stringeeClient;
};

export const addStringeeEventListener = (event, callback) => {
  if (!eventListeners.has(event)) {
    eventListeners.set(event, []);
  }
  eventListeners.get(event).push(callback);

  // Return a function to remove this specific listener
  return () => {
    const listeners = eventListeners.get(event);
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

export const getStringeeClient = () => {
  if (!stringeeClient) {
    console.warn(
      "Stringee client not initialized. Call initializeStringee first."
    );
  }
  return stringeeClient;
};

let _isConnected = false;

export const isStringeeConnected = () => {
  return _isConnected;
};

export const setStringeeConnected = (status) => {
  _isConnected = status;
};
