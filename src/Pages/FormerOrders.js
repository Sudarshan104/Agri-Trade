import { useEffect, useState } from "react";
import API from "../Services/api";
import { getUser } from "../utils/Auth";

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const user = getUser();

  useEffect(() => {
    API.get(`/orders/farmer/${user.id}`)
      .then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>Orders Received</h2>
      {orders.map(o => (
        <div key={o.id}>
          <p>Product: {o.product.name}</p>
          <p>Retailer: {o.retailer.name}</p>
          <p>Quantity: {o.quantity}</p>
          <p>Status: {o.status}</p>
        </div>
      ))}
    </div>
  );
}
