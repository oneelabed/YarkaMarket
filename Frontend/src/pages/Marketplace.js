import React, { useEffect, useState } from "react";
import "./Marketplace.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../components/UserContext";

function Marketplace() {
  const { currentUser } = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/dashboard/market", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const navigate = useNavigate();
  
  const handleStartConversation = async (otherUserId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/dashboard/conversations/start/${otherUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to start conversation");

      const conversation = await res.json();

      // Navigate to notifications page and select the new conversation
      navigate(`/dashboard/conversations?convId=${conversation.id}`);
    } catch (err) {
      console.error(err);
      alert("Could not start conversation. Please try again.");
    }
  };

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="marketplace-container">
      <br></br><br></br>
      <h2 style={{paddingLeft: "120px"}}>Marketplace</h2>
      {listings.length === 0 && <p>No listings found.</p>}
      <ul className="listings-list">
        {listings.map((listing) => (
          <li key={listing.id} className="listing-item">
            {listing.image && (
              <img
                className="listing-image"
                src={`http://localhost:8080/uploads/${listing.image}`}
                alt={listing.title}
              />
            )}
            <div className="listing-details">
              <h3 className="listing-title">{listing.title}</h3>
              <p className="listing-description">{listing.description}</p>
              <div className="listing-meta">
                <span>Category: {listing.category}</span>
                <span className="listing-price">₪{listing.price}</span>
              </div>
              <p className="listing-person">{listing.username}</p>
              {currentUser && currentUser.id !== listing.creator.id && 
              (<button onClick={() => handleStartConversation(listing.creator.id)}>
                Message
              </button>)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Marketplace;
