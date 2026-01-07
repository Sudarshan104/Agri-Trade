import { useEffect, useState } from "react";
import API from "../Services/api";
import { getUser } from "../utils/Auth";
import "./RetailerDashboard.css";

export default function RetailerDashboard() {
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});
  const user = getUser();

  /* ================= LOAD ALL PRODUCTS ================= */
  const loadAllProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadAllProducts();
  }, []);

  /* ================= PLACE ORDER ================= */
  const placeOrder = async (productId) => {
    if (!user?.id) {
      alert("Please login again");
      return;
    }

    const quantity = Number(qty[productId]);

    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      await API.post("/orders", {
        productId: productId,
        retailerId: user.id,
        quantity: quantity,
      });

      alert("Order placed successfully ✅");

      // reload products & reset quantity input
      loadAllProducts();
      setQty((prev) => ({ ...prev, [productId]: "" }));
    } catch (err) {
      console.error("Order failed:", err.response?.data || err);

      // ✅ FIX FOR [object Object]
      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to place order"
      );
    }
  };

  return (
    <div className="retailer-container">
      <h2 className="dashboard-title">Available Products</h2>

      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No products available</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => {
            const inStock = p.quantity > 0;

            return (
              <div className="product-card" key={p.id}>
                {/* PRODUCT IMAGE */}
                {p.imageUrl ? (
                  <img
                    src={`http://localhost:9090${p.imageUrl}`}
                    alt={p.name}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image no-image">No Image</div>
                )}

                <div className="product-content">
                  <h3 className="product-name">{p.name}</h3>

                  <p className="product-detail">
                    Price: ₹{p.price} / kg
                  </p>

                  <p className="product-detail">
                    Available: {p.quantity} kg
                  </p>

                  <p className="farmer-name">
                    Farmer: {p.farmer?.name || "N/A"}
                  </p>

                  <input
                    type="number"
                    min="1"
                    placeholder="Order Quantity"
                    value={qty[p.id] || ""}
                    onChange={(e) =>
                      setQty({ ...qty, [p.id]: e.target.value })
                    }
                    disabled={!inStock}
                  />

                  <button
                    className="order-btn"
                    onClick={() => placeOrder(p.id)}
                    disabled={!inStock}
                  >
                    {inStock ? "Place Order" : "Out of Stock"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
