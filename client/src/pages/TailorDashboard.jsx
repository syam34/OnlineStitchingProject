import { useEffect, useState } from "react";
import axios from "axios";// Adjust path as needed


function TailorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [visibleMeasurements, setvisibleMeasurements] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/tailor/${user._id}`); // ✅ fix ID
      setOrders(res.data);
    } catch (err) {
      console.log("Error fetching orders:", err.message);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/status/${orderId}`, {
        status: newStatus
      });
      setMsg("✅ Order status updated");
      fetchOrders(); // Refresh after update
    } catch (err) {
      setMsg("❌ Failed to update status");
    }
  };

  const toggleMeasurements = (orderId) => {
    setvisibleMeasurements((prev) =>({
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
      <h2>Welcome, {user.name} (Tailor)</h2>
      <button onClick={logout} className="logout-btn">Logout</button>

      <h3>Your Assigned Orders</h3>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <p><strong>Customer:</strong> {order.customerId?.name}</p>
              <p><strong>Fabric:</strong> {order.fabric}</p>

              {/* Toggle Measurements */}
              <button onClick={() => toggleMeasurements(order._id)} style={{ marginBottom: "10px" }}>
                {visibleMeasurements[order._id] ? "Hide Measurements" : "View Measurements"}
              </button>

              {/* Dress Measurements */}
              {visibleMeasurements[order._id] && (
                <Measurements measurements={order} />
                )}

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${order.status.replace(" ", "")}`}>{order.status}</span>
              </p>

              {/* Image View */}
              {order.design && (
                <div>
                  <img
                    src={`http://localhost:5000${order.design}`}
                    alt="Design"
                    className="design-preview"
                    style={{ width: "200px", height: "auto", border: "1px solid #ccc", marginBottom: "10px" }}
                  />
                  <a href={`http://localhost:5000${order.design}`} download target="_blank" rel="noreferrer">
                    ⬇️ Download Image
                  </a>
                </div>
              )}

              {/* Status Update Dropdown */}
              {order.status !== "Completed" && (
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      <p>{msg}</p>
    </div>
  );
}

export default TailorDashboard;
