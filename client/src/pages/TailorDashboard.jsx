import { useEffect, useState } from "react";
import axios from "axios";

function TailorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [visibleMeasurements, setVisibleMeasurements] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/tailor/${user._id}`);
      setOrders(res.data);
    } catch (err) {
      console.log("Error fetching orders:", err.message);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/status/${orderId}`, {
        status: newStatus,
      });
      setMsg("✅ Order status updated");
      fetchOrders();
    } catch (err) {
      setMsg("❌ Failed to update status");
    }
  };

  const toggleMeasurements = (orderId) => {
    setVisibleMeasurements((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container">
      <h2>Welcome, {user?.name} (Tailor)</h2>
      <button onClick={logout} className="btn btn-danger mb-3">Logout</button>

      <h3>Your Assigned Orders</h3>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-4 p-3">
            <h5>Customer: {order.customerId?.name}</h5>
            <p><strong>Fabric:</strong> {order.fabric || "N/A"}</p>

            {order.design && (
              <div className="mb-2">
                <img
                  src={`http://localhost:5000${order.design}`}
                  alt="Design"
                  style={{ width: "200px", height: "auto", border: "1px solid #ccc" }}
                />
                <br />
                <a href={`http://localhost:5000${order.design}`} download target="_blank" rel="noreferrer">
                  ⬇️ Download Design
                </a>
              </div>
            )}

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            {order.status !== "Completed" && (
              <select
                className="form-select mb-2"
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            )}

            {/* Measurements */}
            <button
              className="btn btn-primary btn-sm mb-2"
              onClick={() => toggleMeasurements(order._id)}
            >
              {visibleMeasurements[order._id] ? "Hide Measurements" : "View Measurements"}
            </button>

            {visibleMeasurements[order._id] && order.measurements && (
              <ul>
                {Object.entries(order.measurements).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value} cm
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}

      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}

export default TailorDashboard;
