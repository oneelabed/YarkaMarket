import { useEffect, useState } from "react";
import "./Messages.css"
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../components/UserContext";

function Messages() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialConvId = params.get("convId"); // auto-select this conversation
  
  const { currentUser } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(initialConvId);
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
    <div className="messages-container">
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
            {`${conv.user1.id === currentUser.id ? conv.user2.username : conv.user1.username}`}
          </div>
        ))}
      </div>

      {/* Messages pane */}
      <div className="messages-pane">
        {selectedConvId ? (
          <>
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
          </>
        ) : (
          <div className="no-conversation">
            <p>Select a conversation to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );

}

export default Messages;
