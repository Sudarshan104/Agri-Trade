import { useState } from "react";
import API from "../Services/api";
import { getUser } from "../utils/Auth";
import "./FarmerAddProduct.css"

export default function FarmerAddProduct() {
  const user = getUser();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: ""
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const addProduct = async () => {
    if (!product.name || !product.price || !product.quantity || !image) {
      alert("All fields including image are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", Number(product.price));
      formData.append("quantity", Number(product.quantity));
      formData.append("farmerId", user.id);
      formData.append("image", image);

      await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Product added successfully");
      setProduct({ name: "", price: "", quantity: "" });
      setImage(null);
      document.getElementById("product-image").value = "";

    } catch {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-card">
      <h2>Add Product</h2>

      <div className="form-group">
        <label>Product Name</label>
        <input onChange={e => setProduct({ ...product, name: e.target.value })} />
      </div>

      <div className="form-group">
        <label>Price (₹ / kg)</label>
        <input type="number"
          onChange={e => setProduct({ ...product, price: e.target.value })} />
      </div>

      <div className="form-group">
        <label>Quantity (kg)</label>
        <input type="number"
          onChange={e => setProduct({ ...product, quantity: e.target.value })} />
      </div>

      <div className="form-group">
        <label>Product Image</label>
        <input type="file" id="product-image"
          onChange={e => setImage(e.target.files[0])} />
      </div>

      <button className="add-btn" onClick={addProduct} disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </div>
  );
}
