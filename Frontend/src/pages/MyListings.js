import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyListings.css";

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/dashboard/my-listings", {
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

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mylistings-container">
      <h2>My Listings</h2>
      {listings.length === 0 && <p>You don't have listings.</p>}
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
                <span className="listing-price">${listing.price}</span>
              </div>
              <p className="listing-person">{listing.username}</p>
            </div>
            <Link to={`/dashboard/edit-listing/${listing.id}`} id="edit">Edit</Link><br/><br/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MyListings
