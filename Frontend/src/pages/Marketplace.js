import React, { useEffect, useState } from "react";
import "./Marketplace.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Marketplace() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { currentUser } = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Electronics", "Furniture", "Clothing", "Tools", "Home", "Sports", "Books", "Other"];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${apiUrl}/dashboard/market`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data);
        setFilteredListings(data);
      } catch (err) {
        // console.error(err);
        setError(err.message || "Error fetching listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === "All") {
        setFilteredListings(listings);
    } else {
        setFilteredListings(listings.filter(listing => listing.category === category));
    }
  };

  const handleStartConversation = async (otherUserId) => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        `${apiUrl}/dashboard/conversations/start/${otherUserId}`,
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
      // console.error(err);
      alert("Could not start conversation. Please try again.");
    }
  };

  if (loading) return <p style={{textAlign: "center", marginTop: "50px"}}>Loading listings...</p>;
  if (error) return <p style={{textAlign: "center", marginTop: "50px"}}>Error: {error}</p>;

  return (
    <div className="marketplace-container">
      <h1>Marketplace</h1><br/>

      <select value={selectedCategory} onChange={handleCategoryChange}>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {filteredListings.length === 0 && <p>No listings found.</p>}
      <ul className="listings-list">
        {filteredListings.map((listing) => (
          <li key={listing.id} className="listing-item">
            {listing.image && (
              <img
                className="listing-image"
                src={listing.image}
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
            </div>
            {currentUser && currentUser.id !== listing.creator.id && 
              (<button onClick={() => handleStartConversation(listing.creator.id)} id="message">
                Message
              </button>)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Marketplace;
