import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import webSocketService from '../service/WebSocketService'; // Adjust path as needed
import { UserContext } from './UserContext'; // Adjust path as needed

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const messageCallbacksRef = useRef([]);
  const { currentUser } = useContext(UserContext);

  // Function to subscribe to messages from components
  const subscribeToMessages = useCallback((callback) => {
    messageCallbacksRef.current.push(callback);

    // Return unsubscribe function
    return () => {
      messageCallbacksRef.current = messageCallbacksRef.current.filter(cb => cb !== callback);
    };
  }, []);

  // Initialize WebSocket connection when user is available
  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = localStorage.getItem('token');
      
      if (currentUser && token && !webSocketService.isConnected()) {
        try {
          await webSocketService.connect(token);
          setIsConnected(true);
          console.log('Global WebSocket connected for user:', currentUser.username);

          // Set up global message handler
          const handleMessage = (messageData) => {
            console.log('Global WebSocket message received:', messageData);
            messageCallbacksRef.current.forEach(callback => {
              try {
                callback(messageData);
              } catch (error) {
                console.error('Error in message callback:', error);
              }
            });
          };

          const handleConnect = () => {
            setIsConnected(true);
            console.log('WebSocket connected globally');
          };

          const handleDisconnect = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected globally');
          };

          const handleError = (error) => {
            console.error('Global WebSocket error:', error);
          };

          // Remove any existing callbacks to prevent duplicates
          webSocketService.messageCallbacks = [];
          webSocketService.connectCallbacks = [];
          webSocketService.disconnectCallbacks = [];
          webSocketService.errorCallbacks = [];

          webSocketService.onMessage(handleMessage);
          webSocketService.onConnect(handleConnect);
          webSocketService.onDisconnect(handleDisconnect);
          webSocketService.onError(handleError);

        } catch (error) {
          console.error('Failed to initialize global WebSocket:', error);
          setIsConnected(false);
        }
      } else if (!currentUser || !token) {
        // Disconnect WebSocket when user logs out
        if (webSocketService.isConnected()) {
          webSocketService.disconnect();
          setIsConnected(false);
          console.log('WebSocket disconnected - user logged out');
        }
      }
    };

    initializeWebSocket();
  }, [currentUser]);

  // Cleanup on unmount (when app closes)
  useEffect(() => {
    return () => {
      if (webSocketService.isConnected()) {
        webSocketService.disconnect();
      }
    };
  }, []);

  const value = {
    isConnected,
    subscribeToMessages,
    webSocketService // Expose service for direct access if needed
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
