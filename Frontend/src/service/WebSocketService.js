import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.messageCallbacks = [];
    this.errorCallbacks = [];
    this.connectCallbacks = [];
    this.disconnectCallbacks = [];
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      // Don't connect if already connected
      if (this.connected) {
        resolve();
        return;
      }

      const apiUrl = process.env.REACT_APP_API_URL;

      // Create SockJS connection
      const socket = new SockJS(`${apiUrl}/ws`);
      
      // Create STOMP client
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => {
          // console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // Set up connection callbacks
      this.stompClient.onConnect = (frame) => {
        // console.log('Connected to WebSocket:', frame);
        this.connected = true;
        
        // Subscribe to personal message queue
        this.stompClient.subscribe('/user/queue/messages', (message) => {
          try {
            const messageData = JSON.parse(message.body);
            // console.log('Received WebSocket message:', messageData);
            this.messageCallbacks.forEach(callback => callback(messageData));
          } catch (error) {
            // console.error('Error parsing WebSocket message:', error);
          }
        });

        // Subscribe to error queue
        this.stompClient.subscribe('/user/queue/errors', (error) => {
          try {
            const errorData = JSON.parse(error.body);
            // console.error('WebSocket error:', errorData);
            this.errorCallbacks.forEach(callback => callback(errorData));
          } catch (parseError) {
            // console.error('Error parsing WebSocket error:', parseError);
          }
        });

        // Notify connection callbacks
        this.connectCallbacks.forEach(callback => callback());
        resolve(frame);
      };

      this.stompClient.onStompError = (frame) => {
        // console.error('WebSocket STOMP error:', frame);
        this.connected = false;
        reject(frame);
      };

      this.stompClient.onWebSocketError = (event) => {
        // console.error('WebSocket error:', event);
        this.connected = false;
        reject(event);
      };

      this.stompClient.onDisconnect = () => {
        // console.log('Disconnected from WebSocket');
        this.connected = false;
        this.disconnectCallbacks.forEach(callback => callback());
      };

      // Activate the client
      this.stompClient.activate();
    });
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
      // console.log('WebSocket disconnected manually');
    }
  }

  // Add callback for incoming messages
  onMessage(callback) {
    this.messageCallbacks.push(callback);
  }

  // Remove message callback
  removeMessageCallback(callback) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  // Add callback for errors
  onError(callback) {
    this.errorCallbacks.push(callback);
  }

  // Remove error callback
  removeErrorCallback(callback) {
    this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
  }

  // Add callback for connection established
  onConnect(callback) {
    this.connectCallbacks.push(callback);
  }

  // Add callback for disconnection
  onDisconnect(callback) {
    this.disconnectCallbacks.push(callback);
  }

  isConnected() {
    return this.connected;
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;