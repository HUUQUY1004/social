// services/stringeeService.js
let connectedStringeeClient = null;
let isClientConnected = false;

export const setStringeeClient = (client) => {
  connectedStringeeClient = client;
};

export const getStringeeClient = () => {
  return connectedStringeeClient;
};

export const setConnectionStatus = (status) => {
  isClientConnected = status;
};

export const isStringeeConnected = () => {
  return isClientConnected;
};

export const addStringeeEventListener = (event, callback) => {
  if (connectedStringeeClient) {
    connectedStringeeClient.on(event, callback);
  }
};
