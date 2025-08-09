import "./ListingCard.css"

function ListingCard({ title, description, price, imageUrl }) {
  return (
    <div className="listing-card">
      <img src={imageUrl} alt={title} className="listing-image" />
      <h3>{title}</h3>
      <p>{description}</p>
      <strong>{price} ₪</strong>
    </div>
  );
}

export default ListingCard;
