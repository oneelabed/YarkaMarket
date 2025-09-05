import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function Notifications() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialConvId = params.get("convId");

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(initialConvId);
  const [newMessage, setNewMessage] = useState("");
  const [client, setClient] = useState(null);

  // Fetch conversations when component mounts
  useEffect(() => {
    fetch("http://localhost:8080/dashboard/conversations", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => setConversations(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConvId) {
      fetch(`http://localhost:8080/dashboard/conversations/${selectedConvId}/messages`, {
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error(err));
    }
  }, [selectedConvId]);

  // WebSocket setup
  useEffect(() => {
    if (!selectedConvId) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe(
        `/topic/dashboard/conversations/${selectedConvId}/messages`,
        (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        }
      );
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [selectedConvId]);

  const handleSendMessage = () => {
    if (client && client.connected && newMessage.trim() !== "") {
      client.publish({
        destination: `/app/dashboard/conversations/${selectedConvId}/messages`,
        body: JSON.stringify({
          senderId: 1, // TODO: replace with actual logged-in user ID
          content: newMessage,
        }),
      });
      setNewMessage("");
    }
  };

  return (
    <div className="notifications">
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            onClick={() => setSelectedConvId(conv.id)}
            style={{
              cursor: "pointer",
              fontWeight: conv.id === selectedConvId ? "bold" : "normal",
            }}
          >
            Conversation {conv.id}
          </li>
        ))}
      </ul>

      {selectedConvId && (
        <div className="chat-box">
          <h3>Messages in Conversation {selectedConvId}</h3>
          <div className="messages">
            {messages.map((msg) => (
              <div key={msg.id}>
                <strong>{msg.senderId}</strong>: {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default Notifications;