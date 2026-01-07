import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import FarmerHome from "./Pages/FarmerHome";
import FarmerDashboard from "./Pages/FarmerDashboard";
import FarmerProducts from "./Pages/FarmerProducts";
import FarmerOrders from "./Pages/FormerOrders";
import FarmerLayout from "./Pages/FarmerLayout";

import RetailerHome from "./Pages/RetailerHome";
import RetailerDashboard from "./Pages/RetailerDashboard"; // ✅ IMPORTANT
import RetailerOrders from "./Pages/RetailOrders";
import FarmerAddProduct from "./Pages/FormerAddProduct";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* FARMER ROUTES */}
       <Route path="/farmer" element={<FarmerLayout />}>
  <Route index element={<FarmerDashboard />} />
  <Route path="add-product" element={<FarmerAddProduct />} />
  <Route path="products" element={<FarmerProducts/>} />
  <Route path="orders" element={<FarmerOrders />} />
</Route>


        {/* RETAILER ROUTES */}
        <Route
          path="/retailer"
          element={
            <ProtectedRoute role="RETAILER">
              <RetailerHome />
            </ProtectedRoute>
          }
        />

        {/* ✅ THIS WAS MISSING */}
        <Route
          path="/retailer/products"
          element={
            <ProtectedRoute role="RETAILER">
              <RetailerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/retailer/orders"
          element={
            <ProtectedRoute role="RETAILER">
              <RetailerOrders />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
