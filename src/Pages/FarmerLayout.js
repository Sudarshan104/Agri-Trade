import { Outlet, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/Auth";
import { useState } from "react";
import "./FarmerLayout.css";

export default function FarmerLayout() {
  const user = getUser();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className={`dashboard-container ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* ✅ HEADER */}
        <div className="sidebar-header">
          

          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/farmer")}>
            📊 {!collapsed && "Dashboard"}
          </li>
          <li onClick={() => navigate("/farmer/add-product")}>
            ➕ {!collapsed && "Add Products"}
          </li>
          <li onClick={() => navigate("/farmer/products")}>
            📦 {!collapsed && "My Products"}
          </li>
          <li>🧾 {!collapsed && "Orders"}</li>
          <li>📈 {!collapsed && "Analytics"}</li>
          <li
            className="logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            🚪 {!collapsed && "Logout"}
          </li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
