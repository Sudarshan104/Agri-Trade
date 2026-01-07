
import { useEffect, useState } from "react";
import API from "../Services/api";
import { getUser } from "../utils/Auth";
import "./FarmerProducts.css";

export default function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const user = getUser();

  useEffect(() => {
    if (!user?.id) return;

    API.get(`/products/farmer/${user.id}`)
      .then(res => {
        setProducts(res.data || []);
      })
      .catch(err => {
        console.error("Failed to load farmer products", err);
        setProducts([]);
      });
  }, [user?.id]);

  return (
    <div className="products-container">
      <h2 className="products-title">My Products</h2>
      <p className="products-subtitle">
        View your added products and remaining stock
      </p>

      {products.length === 0 ? (
        <p className="no-products">No products added yet</p>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <div className="product-card" key={p.id}>
              {p.imageUrl ? (
                <img
                  src={`http://localhost:9090${p.imageUrl}`}
                  alt={p.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image no-image">
                  No Image
                </div>
              )}

              <div className="product-content">
                <h3 className="product-name">{p.name}</h3>

                <p className="product-detail">
                  <span>Price:</span> ₹{p.price} / kg
                </p>

                <p className="product-detail">
                  <span>Remaining:</span> {p.quantity} kg
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
