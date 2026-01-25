import { useEffect, useMemo, useState } from "react";
import API from "../Services/api";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ filter state
  const [filter, setFilter] = useState("ALL"); // ALL | PENDING | DELIVERED | CANCELLED

  /* ================= LOAD ALL ORDERS ================= */
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      // ✅ correct endpoint (based on your backend mapping)
      const res = await API.get("/orders/admin");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Load orders error:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE ORDER STATUS ================= */
  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/admin/${orderId}/status`, {
        status: newStatus,
      });
      alert("Status updated successfully ✅");
      loadOrders();
    } catch (err) {
      console.error("Status update error:", err);
      let errorMessage = "Failed to update status";

      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      alert(`Failed to update status: ${errorMessage}`);
    }
  };

  /* ================= CANCEL ORDER ================= */
  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await API.put(`/orders/admin/${id}/cancel`);
      loadOrders();
    } catch (err) {
      console.error("Cancel error:", err.response || err);
      alert(err.response?.data || "Failed to cancel order");
    }
  };

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = useMemo(() => {
    if (filter === "ALL") return orders;

    if (filter === "PENDING") {
      return orders.filter((o) =>
        ["PLACED", "PROCESSING", "MODIFIED"].includes(o.status)
      );
    }

    if (filter === "DELIVERED") {
      return orders.filter((o) => o.status === "DELIVERED");
    }

    if (filter === "CANCELLED") {
      return orders.filter((o) => o.status === "CANCELLED");
    }

    return orders;
  }, [orders, filter]);

  /* ================= UI ================= */
  return (
    <div className="admin-page">
      <h2 className="page-title">Manage Orders</h2>

      {/* ✅ ORDER FILTERS TOP */}
      <div className="order-filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All ({orders.length})
        </button>

        <button
          className={filter === "PENDING" ? "active" : ""}
          onClick={() => setFilter("PENDING")}
        >
          Pending (
          {
            orders.filter((o) =>
              ["PLACED", "PROCESSING", "MODIFIED"].includes(o.status)
            ).length
          }
          )
        </button>

        <button
          className={filter === "DELIVERED" ? "active" : ""}
          onClick={() => setFilter("DELIVERED")}
        >
          Delivered ({orders.filter((o) => o.status === "DELIVERED").length})
        </button>

        <button
          className={filter === "CANCELLED" ? "active" : ""}
          onClick={() => setFilter("CANCELLED")}
        >
          Cancelled ({orders.filter((o) => o.status === "CANCELLED").length})
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Retailer</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="empty">
                  Loading orders...
                </td>
              </tr>
            )}

            {!loading &&
              filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.product?.name}</td>
                  <td>{o.retailer?.name}</td>
                  <td>{o.quantity} kg</td>

                  {/* ✅ STATUS DROPDOWN */}
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      disabled={o.status === "CANCELLED"}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="STOCK_CONFIRMED">STOCK_CONFIRMED</option>
                      <option value="PACKED">PACKED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="MODIFIED">MODIFIED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td>₹ {o.totalAmount}</td>

                  <td>
                    <button
                      className="danger-btn"
                      disabled={o.status === "CANCELLED"}
                      onClick={() => cancelOrder(o.id)}
                    >
                      {o.status === "CANCELLED" ? "Cancelled" : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">
                  No orders found for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
