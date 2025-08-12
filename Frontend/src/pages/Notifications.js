import { useEffect, useState } from "react";
import "./Notifications.css"

function Notifications() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/dashboard/conversations/${selectedConvId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMsg }),
      });
      if (!res.ok) throw new Error("Send failed");
      const sentMsg = await res.json();
      setMessages(prev => [...prev, sentMsg]);
      setNewMsg("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversations once when component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/dashboard/conversations", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        setConversations(data);
        if (data.length > 0) setSelectedConvId(data[0].id);  // select first conversation by default
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [token]);

  // Fetch messages whenever selected conversation changes
  useEffect(() => {
    if (!selectedConvId) return;
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/dashboard/conversations/${selectedConvId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedConvId, token]);
  if (loading) return <p>Loading conversations...</p>;

  return (
    <div className="notifications-container">
      {/* Conversations sidebar */}
      <div className="conversations-list">
        {conversations.length === 0 && <p>No conversations</p>}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={
              "conversation-item " +
              (conv.id === selectedConvId ? "selected" : "")
            }
            onClick={() => setSelectedConvId(conv.id)}
          >
            {conv.title || `Conversation ${conv.id}`}
          </div>
        ))}
      </div>

      {/* Messages pane */}
      <div className="messages-pane">
        {messages.length === 0 && <p>No messages in this conversation.</p>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.senderUsername === "YOUR_LOGGED_IN_USERNAME"
                ? "sent"
                : "received"
            }`}
          >
            <strong>{msg.senderUsername}: </strong>
            {msg.content}
          </div>
        ))}

        {/* Message input */}
        <div className="message-input-container">
          <input
            className="message-input"
            type="text"
            placeholder="Type your message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={loading}
          />
          <button
            className="send-button"
            onClick={sendMessage}
            disabled={loading || !newMsg.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
