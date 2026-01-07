import { useEffect, useState } from "react";
import API from "../Services/api";
import { getUser } from "../utils/Auth";

export default function FarmerDashboard() {
  const user = getUser();

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadDashboardData = async () => {
      try {
        const productsRes = await API.get(`/products/farmer/${user.id}`);
        setTotalProducts(productsRes.data.length);

        const summaryRes = await API.get(
          `/api/orders/farmer/${user.id}/summary`
        );

        console.log("Dashboard summary:", summaryRes.data);

        setTotalOrders(summaryRes.data.totalOrders ?? 0);
        setProcessingOrders(summaryRes.data.processingOrders ?? 0);
        setCancelledOrders(summaryRes.data.cancelledOrders ?? 0);
        setTotalRevenue(summaryRes.data.totalRevenue ?? 0);

      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  return (
    <>
      <div className="welcome-card">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>Manage your products and track your sales</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{loading ? "…" : totalProducts}</h3>
          <p>Total Products</p>
        </div>

        <div className="stat-card">
          <h3>{loading ? "…" : totalOrders}</h3>
          <p>Total Orders</p>
        </div>

        <div className="stat-card">
          <h3>{loading ? "…" : processingOrders}</h3>
          <p>Orders Processing</p>
        </div>

        <div className="stat-card">
          <h3>{loading ? "…" : cancelledOrders}</h3>
          <p>Orders Cancelled</p>
        </div>

        <div className="stat-card">
          <h3>{loading ? "…" : `₹ ${totalRevenue}`}</h3>
          <p>Total Revenue</p>
        </div>
      </div>
    </>
  );
}
