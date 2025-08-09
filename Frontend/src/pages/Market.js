import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";

function Market() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/listings")
      .then((res) => res.json())
      .then((data) => setListings(data));
  }, []);

  return (
    <div className="listings-grid">
      {listings.map((item) => (
        <ListingCard
          key={item.id}
          title={item.title}
          description={item.description}
          price={item.price}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
}

export default Market