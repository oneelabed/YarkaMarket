import { useEffect, useState, useCallback, useRef } from "react";
import "./Messages.css"
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useWebSocket } from "../context/WebSocketContext";
import { Send } from "lucide-react";
import { Helmet } from "react-helmet-async";

function Messages() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialConvId = params.get("convId");
  
  const { currentUser } = useContext(UserContext);
  // eslint-disable-next-line
  const { isConnected: wsConnected, subscribeToMessages } = useWebSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(initialConvId);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const token = sessionStorage.getItem("token");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleWebSocketMessage = useCallback((messageData) => {
    // console.log('Messages component received WebSocket message:', messageData);
    // Add message if it belongs to the currently selected conversation
    if (messageData.conversationId === parseInt(selectedConvId)) {
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(msg => msg.id === messageData.id);
        if (!exists) {
          return [...prev, {
            id: messageData.id,
            content: messageData.content,
            timestamp: messageData.timestamp,
            sender: {
              id: messageData.senderId,
              username: messageData.senderUsername
            },
            conversation: {
              id: messageData.conversationId
            }
          }];
        }
        return prev;
      });
    }
    
    // Update conversation list to reflect new message (update lastUpdated)
    setConversations(prev => 
      prev.map(conv => 
        conv.id === messageData.conversationId 
          ? { ...conv, lastUpdated: messageData.timestamp }
          : conv
      )
    );
  }, [selectedConvId]);

  // Subscribe to WebSocket messages when component mounts
  useEffect(() => {
    if (subscribeToMessages) {
      const unsubscribe = subscribeToMessages(handleWebSocketMessage);
      
      // Cleanup subscription when component unmounts
      return unsubscribe;
    }
  }, [subscribeToMessages, handleWebSocketMessage]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    
    try {
      const res = await fetch(`${apiUrl}/dashboard/conversations/${selectedConvId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMsg }),
      });
      
      if (!res.ok) throw new Error("Send failed");
      const sentMsg = await res.json();
      
      // Add message to local state immediately
      setMessages(prev => [...prev, sentMsg]);
      setNewMsg("");
      
      // The WebSocket notification will be sent automatically by MessagingService
      
    } catch (err) {
      // console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/dashboard/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        setConversations(data);
        if (data.length > 0 && !selectedConvId) {
          setSelectedConvId(data[0].id.toString());
        }
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchConversations();
    }
    // eslint-disable-next-line
  }, [apiUrl, token]);

  useEffect(() => {
    if (!selectedConvId || !token) return;
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${apiUrl}/dashboard/conversations/${selectedConvId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);

        await fetch(`${apiUrl}/dashboard/markAsRead/${selectedConvId}/${currentUser.id}`, {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
      } catch (err) {
        // console.error(err);
      } 
    };
    
    fetchMessages();
  }, [currentUser, selectedConvId, token, apiUrl]);

  const handleSelectConversation = (convId) => {
    setSelectedConvId(convId);

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id.toString() === convId) {
          if (conv.user1.id === currentUser.id) {
            return { ...conv, unreadUser1: 0 };
          } else if (conv.user2.id === currentUser.id) {
            return { ...conv, unreadUser2: 0 };
          }
        }
        return conv;
      })
    );
  };


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Yarka Market - Home</title>
        <link rel="canonical" href="https://yarkamarket.org/dashboard/conversations" />
      </Helmet>
      <h1 id="title">
        Messages 
      </h1> 
      
      <div className="messages-container">
        <div className="conversations-list">
          {conversations.length === 0 && <p>&nbsp;&nbsp;No conversations</p>}
          {conversations.map((conv) => {
            const isUser1 = conv.user1.id === currentUser.id;
            const otherUser = isUser1 ? conv.user2 : conv.user1;
            const unreadCount = isUser1 ? conv.unreadUser1 : conv.unreadUser2;

            return (
              <div
                key={conv.id}
                className={
                  "conversation-item " +
                  (conv.id.toString() === selectedConvId ? "selected" : "")
                }
                onClick={() => handleSelectConversation(conv.id.toString())}
              >
                <span>{otherUser.username}</span>
                {unreadCount > 0 && (
                  <div className="badge-container">
                    <span className="message-badge-conv">{unreadCount}</span>
                  </div>
                )}
              </div> 
            );
          })}
        </div>

        <div className="messages-pane">
          {selectedConvId ? (
            <>
              <div className="messages-list">
                {messages.length === 0 && <p>No messages in this conversation.</p>}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${
                      msg.sender.username === currentUser.username
                        ? "sent"
                        : "received"
                    }`}
                  >
                    {msg.content}
                    <div className="message-time">
                      {new Date(msg.timestamp).toString().slice(4, 10) + " | " + new Date(msg.timestamp).toLocaleTimeString().slice(0, -3)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-container">
                <input
                  className="message-input"
                  type="text"
                  placeholder="Type your message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={loading}
                />
                <button
                  className="send-button"
                  onClick={sendMessage}
                  disabled={loading || !newMsg.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <p>Select a conversation to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;