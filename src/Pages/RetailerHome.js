import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/Auth";
import API from "../Services/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import "./RetailerHome.css";

/* ✅ Chart Colors */
const CHART_COLORS = ["#2563eb", "#f97316", "#22c55e", "#ef4444", "#8b5cf6"];

export default function RetailerHome() {
  const navigate = useNavigate();
  const user = getUser();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    processingOrders: 0,
    cancelledOrders: 0,
    totalSpent: 0,
  });

  // ✅ analytics
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
      loadAnalytics();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      // ✅ 1️⃣ Available products
      const productsRes = await API.get("/products");

      // ✅ 2️⃣ Retailer orders
      const ordersRes = await API.get(`/orders/retailer/${user.id}`);

      // ✅ 3️⃣ Retailer revenue
      const revenueRes = await API.get(`/orders/retailer/${user.id}/revenue`);

      const orders = ordersRes.data || [];

      // ✅ Processing includes PLACED + PROCESSING + MODIFIED
      const processing = orders.filter((o) =>
        ["PLACED", "PROCESSING", "MODIFIED"].includes(o.status)
      ).length;

      const cancelled = orders.filter((o) => o.status === "CANCELLED").length;

      setStats({
        totalProducts: productsRes.data?.length ?? 0,
        totalOrders: orders.length,
        processingOrders: processing,
        cancelledOrders: cancelled,
        totalSpent: revenueRes.data?.totalRevenue ?? 0,
      });
    } catch (err) {
      console.error("Failed to load retailer dashboard", err);
    }
  };

  const loadAnalytics = async () => {
    try {
      if (!user?.id) return;
      setLoadingAnalytics(true);

      // ✅ Retailer analytics endpoint
      const res = await API.get(`/orders/retailer/${user.id}/analytics`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to load retailer analytics", err);
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  /* ================= CHART DATA ================= */
  const statusData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: "Placed", value: analytics.placedOrders || 0 },
      { name: "Modified", value: analytics.modifiedOrders || 0 },
      { name: "Processing", value: analytics.processingOrders || 0 },
      { name: "Delivered", value: analytics.deliveredOrders || 0 },
      { name: "Cancelled", value: analytics.cancelledOrders || 0 },
    ];
  }, [analytics]);

  const monthlyData = useMemo(() => {
    if (!analytics?.monthlyTransactions) return [];
    return Object.entries(analytics.monthlyTransactions).map(([month, count]) => ({
      month,
      count,
    }));
  }, [analytics]);

  const topProductsData = useMemo(() => {
    if (!analytics?.topPurchasedProducts) return [];
    return analytics.topPurchasedProducts.map((p) => ({
      name: p.name,
      quantity: p.quantity,
    }));
  }, [analytics]);

  return (
    <div className="retailer-dashboard">
      {/* ===== WELCOME ===== */}
      <div className="retailer-welcome">
        <h1>
          Welcome, {user?.name} <span>👋</span>
        </h1>
        <p>Retailer Dashboard Overview</p>
      </div>

      {/* ===== DASHBOARD CARDS ===== */}
      <div className="dashboard-cards">
        <div
          className="dashboard-card"
          onClick={() => navigate("/retailer/products")}
        >
          <h3>{stats.totalProducts}</h3>
          <p>Available Products</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/retailer/orders")}
        >
          <h3>{stats.totalOrders}</h3>
          <p>Total Orders</p>
        </div>

        <div className="dashboard-card processing">
          <h3>{stats.processingOrders}</h3>
          <p>Processing Orders</p>
        </div>

        <div className="dashboard-card cancelled">
          <h3>{stats.cancelledOrders}</h3>
          <p>Cancelled Orders</p>
        </div>

        <div className="dashboard-card amount">
          <h3>₹ {stats.totalSpent}</h3>
          <p>Total Amount Spent</p>
        </div>
      </div>

      {/* ✅ ANALYTICS SECTION */}
      <div className="analytics-section">
        <h2 className="analytics-title">📊 Retailer Analytics</h2>

        {loadingAnalytics ? (
          <p>Loading analytics...</p>
        ) : !analytics ? (
          <p>No analytics available.</p>
        ) : (
          <div className="analytics-grid">
            {/* ✅ PIE */}
            <div className="analytics-box">
              <h4>Orders by Status</h4>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label
                    >
                      {statusData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ✅ LINE */}
            <div className="analytics-box">
              <h4>Monthly Delivered Orders</h4>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ✅ BAR */}
            <div className="analytics-box">
              <h4>Top Purchased Products</h4>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" radius={[10, 10, 0, 0]}>
                      {topProductsData.map((_, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
