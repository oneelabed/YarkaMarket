import { useState } from "react";
import "./CreateListing.css"

function CreateListing() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categories = ["Electronics", "Furniture", "Clothing", "Tools", "Home", "Sports", "Books", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!image) {
      setMessage("You have to upload an image");  
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("price", formData.price);
      form.append("image", image);

      const response = await fetch(`${apiUrl}/dashboard/create-listing`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      // console.log(response);
      
      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      setMessage("Listing created successfully!");
      setFormData({ title: "", description: "", category: "", price: ""});
      setImage();
    } catch (error) {
      // console.error(error);
      setMessage("Error creating listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-container">
      <h2>Create Listing</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea id="description"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          wrap="hard"
        ></textarea>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <div className="uploader-container">
          <label htmlFor="image-upload" className="upload-btn">
            Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden-input"
          />
        </div>
        <br></br><br></br>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
      <br></br>
      {message && <p>{message}</p>}
    </div>
  )
}

export default CreateListing