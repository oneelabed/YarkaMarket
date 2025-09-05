/*import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws"); // maps to /ws in Spring config
  stompClient = over(socket);

  stompClient.connect({}, () => {
    console.log("Connected to WebSocket");

    // subscribe to conversation updates
    // (subscribe dynamically in component)
  });
};

export const subscribeToConversation = (conversationId, onMessageReceived) => {
  if (!stompClient) return;

  stompClient.subscribe(`/topic/conversations/${conversationId}`, (message) => {
    const body = JSON.parse(message.body);
    onMessageReceived(body);
  });
};

export const sendMessage = (msgDTO) => {
  if (stompClient) {
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(msgDTO));
  }
};*/
