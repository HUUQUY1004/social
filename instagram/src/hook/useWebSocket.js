import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocket = (userId, onMessageReceived) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:5000/ws"),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
          onMessageReceived(JSON.parse(message.body));
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
    });

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, [userId]);

  const sendMessage = (message) => {
    if (client) {
      client.publish({
        destination: "/app/chat",
        body: JSON.stringify(message),
      });
    }
  };

  return { sendMessage };
};

export default useWebSocket;
