import { useEffect, useMemo, useState } from "react";
import API from "../Services/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import "./AdminDashboard.css";

const CHART_COLORS = ["#2563eb", "#f97316", "#22c55e", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // ✅ NO "/api" because baseURL already includes "/api"
      const usersRes = await API.get("/admin/users");
      const productsRes = await API.get("/admin/products");
      const ordersRes = await API.get("/orders/admin");
      const revenueRes = await API.get("/orders/admin/revenue");

      const allOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      setOrders(allOrders);

      setStats({
        users: usersRes.data?.length ?? 0,
        products: productsRes.data?.length ?? 0,
        orders: allOrders.length ?? 0,

        // ✅ small safe fix: make sure revenue is number
        revenue: Number(revenueRes.data?.adminCommission ?? 0),
      });
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== CHART DATA ===================== */

  // ✅ Pie: status counts
  const statusData = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const s = o.status || "UNKNOWN";
      map[s] = (map[s] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [orders]);

  // ✅ Line: monthly total orders (current year)
  const monthlyOrders = useMemo(() => {
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const counts = new Array(12).fill(0);

    orders.forEach((o) => {
      if (!o.orderDate) return;
      const d = new Date(o.orderDate);
      const monthIndex = d.getMonth();
      counts[monthIndex] += 1;
    });

    return monthNames.map((m, i) => ({
      month: m,
      orders: counts[i],
    }));
  }, [orders]);

  // ✅ Bar: monthly revenue (only DELIVERED)
  const monthlyRevenue = useMemo(() => {
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const revenue = new Array(12).fill(0);

    orders.forEach((o) => {
      if (!o.orderDate) return;
      if (o.status !== "DELIVERED") return;

      const d = new Date(o.orderDate);
      const monthIndex = d.getMonth();
      revenue[monthIndex] += Number(o.totalAmount || 0);
    });

    return monthNames.map((m, i) => ({
      month: m,
      revenue: Math.round(revenue[i]),
    }));
  }, [orders]);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">System-wide overview</p>
        </div>

        <button className="admin-refresh" onClick={loadStats}>
          ⟳ Refresh
        </button>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <h2>{loading ? "…" : stats.users}</h2>
          <p>Total Users</p>
        </div>

        <div className="admin-card">
          <h2>{loading ? "…" : stats.products}</h2>
          <p>Total Products</p>
        </div>

        <div className="admin-card">
          <h2>{loading ? "…" : stats.orders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="admin-card revenue">
          <h2>{loading ? "…" : `₹ ${Math.round(stats.revenue)}`}</h2>
          <p>Total Revenue</p>
        </div>
      </div>

      {/* ✅ CHARTS SECTION */}
      <div className="admin-analytics">
        <h2 className="analytics-title">📊 Admin Analytics</h2>

        {loading ? (
          <p>Loading charts...</p>
        ) : orders.length === 0 ? (
          <p>No orders found to generate analytics.</p>
        ) : (
          <div className="admin-chart-grid">
            {/* ✅ PIE */}
            <div className="admin-chart-box">
              <h3>Orders by Status</h3>
              <div className="chart-wrap">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                      paddingAngle={3}
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
                    <Legend verticalAlign="bottom" height={45} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ✅ LINE */}
            <div className="admin-chart-box">
              <h3>Monthly Orders</h3>
              <div className="chart-wrap">
                <ResponsiveContainer>
                  <LineChart
                    data={monthlyOrders}
                    margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
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
            <div className="admin-chart-box span-2">
              <h3>Monthly Revenue (Delivered Orders)</h3>
              <div className="chart-wrap">
                <ResponsiveContainer>
                  <BarChart
                    data={monthlyRevenue}
                    margin={{ top: 10, right: 15, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                      {monthlyRevenue.map((_, index) => (
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
