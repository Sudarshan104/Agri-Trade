import { useEffect, useState } from "react";
import API from "../Services/api";
import { getUser } from "../utils/Auth";
import "./RetailerOrders.css";

export default function RetailerOrders() {
  const [orders, setOrders] = useState([]);
  const user = getUser();

  // ================= LOAD ORDERS =================
  const loadOrders = async () => {
    if (!user?.id) return;

    try {
      const res = await API.get(`/orders/retailer/${user.id}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?.id]);

  // ================= EDIT ORDER =================
  const editOrder = async (order) => {
    const newQty = prompt("Enter new quantity", order.quantity);
    if (!newQty || newQty <= 0) return;

    try {
      await API.put(`/orders/${order.id}`, {
        quantity: newQty
      });
      alert("Order updated successfully");
      loadOrders();
    } catch (err) {
      alert(err.response?.data || "Failed to update order");
    }
  };

  // ================= CANCEL ORDER =================
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await API.delete(`/orders/${orderId}`);
      alert("Order cancelled successfully");
      loadOrders();
    } catch (err) {
      alert(err.response?.data || "Failed to cancel order");
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>
      <p className="orders-subtitle">
        Track your placed orders and their current status
      </p>

      {orders.length === 0 ? (
        <p className="no-orders">No orders placed yet</p>
      ) : (
        <div className="orders-grid">
          {orders.map(order => {
            const product = order.product;

            return (
              <div className="order-card" key={order.id}>

                {/* PRODUCT IMAGE */}
                {product?.imageUrl ? (
                  <img
                    src={`http://localhost:9090${product.imageUrl}`}
                    alt={product.name}
                    className="order-product-image"
                  />
                ) : (
                  <div className="order-product-image no-image">
                    No Image
                  </div>
                )}

                {/* PRODUCT NAME */}
                <h3 className="order-product">
                  {product?.name || "Product unavailable"}
                </h3>

                {/* QUANTITY */}
                <p className="order-detail">
                  <span>Quantity:</span> {order.quantity} kg
                </p>

                {/* PRICE */}
                <p className="order-detail">
                  <span>Price:</span>{" "}
                  {product?.price ? `₹${product.price} / kg` : "N/A"}
                </p>

                {/* STATUS */}
                <p className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </p>

                {/* ================= ACTION BUTTONS ================= */}
                {["PLACED", "MODIFIED"].includes(order.status) && (
                  <div className="order-actions">
                    <button
                      className="edit-btn"
                      onClick={() => editOrder(order)}
                    >
                      Edit
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
