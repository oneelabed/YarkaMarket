import { useEffect, useState, useCallback, useRef } from "react";
import "./Messages.css"
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useWebSocket } from "../context/WebSocketContext";
import { Send } from "lucide-react";

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

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle incoming WebSocket messages
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

  // Send message function - uses REST API (your existing endpoint)
  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    
    setLoading(true);
    try {
      // Use your existing REST API endpoint
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversations once when component mounts
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
  }, [token, selectedConvId]);

  // Fetch messages whenever selected conversation changes
  useEffect(() => {
    if (!selectedConvId || !token) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/dashboard/conversations/${selectedConvId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedConvId, token]);

  if (loading && conversations.length === 0) {
    return <div>Loading conversations...</div>;
  }

  return (
    <div>
      <h1 id="title">
        Messages 
      </h1> 
      
      <div className="messages-container">
        {/* Conversations sidebar */}
        <div className="conversations-list">
          {conversations.length === 0 && <p>&nbsp;&nbsp;No conversations</p>}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={
                "conversation-item " +
                (conv.id.toString() === selectedConvId ? "selected" : "")
              }
              onClick={() => setSelectedConvId(conv.id.toString())}
            >
              {`${conv.user1.id === currentUser.id ? conv.user2.username : conv.user1.username}`}
            </div>
          ))}
        </div>

        {/* Messages pane */}
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
                      {new Date(msg.timestamp).toLocaleTimeString().slice(0, -3)}
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