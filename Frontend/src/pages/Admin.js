import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";
import activate from "../images/activate.png";

function Admin() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConversations: 0,
    messagesToday: 0
  });
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const resStats = await fetch(`${apiUrl}/admin/stats`);
        const statsData = await resStats.json();
        setStats(statsData);

        // Fetch users
        const resUsers = await fetch(`${apiUrl}/admin/users`);
        const usersData = await resUsers.json();
        setUsers(usersData);

        // Fetch conversations
        const resConvs = await fetch(`${apiUrl}/admin/conversations`);
        const convsData = await resConvs.json();
        setConversations(convsData);

      } catch (err) {
        // console.error("Failed to fetch admin data:", err);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleActivate = async (userId, e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        `${apiUrl}/admin/activate/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to activate user");

      setUsers(users.map(u => 
        u.id === userId ? { ...u, isApproved: true } : u
      ));
    } catch (err) {
      // console.error(err);
      alert("Could not activate user. Please try again.");
    }
  };

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </li>
          <li
            className={activeTab === "conversations" ? "active" : ""}
            onClick={() => setActiveTab("conversations")}
          >
            Conversations
          </li>
          <li>
            <Link to="/dashboard/market" id="link">Back to market</Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <br/><br/>
        {activeTab === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <div className="stats">
              <div className="card">Total Users: {stats.totalUsers}</div>
              <div className="card">
                Active Conversations: {stats.totalConversations}
              </div>
              <div className="card">
                Messages Today: {stats.messagesToday}
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <h1>Users</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.isApproved ? "Active" : "Banned"} 
                        {!user.isApproved && <button type="button" onClick={(e) => handleActivate(user.id, e)}
                          id="activateButton"><img alt="activateButton" 
                          src={activate} id="activate" ></img></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "conversations" && (
          <>
            <h1>Conversations</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User 1</th>
                  <th>User 2</th>
                  <th>Last Message</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map(conv => (
                  <tr key={conv.id}>
                    <td>{conv.id}</td>
                    <td>{conv.user1.email}</td>
                    <td>{conv.user2.email}</td>
                    <td>{conv.lastUpdated && conv.lastUpdated.toString().slice(0,10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  )
}

export default Admin