import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      const url =
        user.role === "customer"
          ? `http://localhost:5000/api/orders/customer/${user._id}`
          : `http://localhost:5000/api/orders/tailor/${user._id}`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px" }}>
            <p><strong>Fabric:</strong> {order.fabric}</p>
            <p><strong>Status:</strong> {order.status}</p>

            {/* Display static measurements */}
            <p><strong>Measurements:</strong></p>
            <ul>
              <li>Shoulder size: 14 </li> {/* Example static measurement */}
              <li>Neck: 24 </li> {/* Example static measurement */}
              <li>Collar: 14</li> {/* Example static measurement */}
              <li>Chest: 34 </li>
              <li>Waist: 36</li>
              <li>Sleeve: 20</li>
            </ul>

            {user.role === "customer" && (
              <>
                <p><strong>Tailor:</strong> {order.tailorId?.name}</p>
                {order.design && <img src={`http://localhost:5000${order.design}`} width="150" alt="Design" />}

                {order.status === "Pending" && (
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="text"
                      placeholder="New Fabric"
                      value={order.fabric}
                      onChange={(e) =>
                        setOrders((prev) =>
                          prev.map((o) =>
                            o._id === order._id ? { ...o, fabric: e.target.value } : o
                          )
                        )
                      }
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setOrders((prev) =>
                          prev.map((o) =>
                            o._id === order._id ? { ...o, newFile: e.target.files[0] } : o
                          )
                        )
                      }
                    />

                    <button
                      onClick={async () => {
                        const formData = new FormData();
                        formData.append("fabric", order.fabric);
                        if (order.newFile) formData.append("designFile", order.newFile);
                        await axios.put(`http://localhost:5000/api/orders/edit/${order._id}`, formData);
                        fetchOrders();
                      }}
                    >
                      Save
                    </button>

                    <button
                      style={{ marginLeft: "10px", color: "red" }}
                      onClick={async () => {
                        await axios.delete(`http://localhost:5000/api/orders/delete/${order._id}`);
                        fetchOrders();
                      }}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </>
            )}

            {user.role === "tailor" && (
              <>
                <p><strong>Customer:</strong> {order.customerId?.name}</p>
                {order.design && (
              <img
                src={`http://localhost:5000${order.design}`}
                className="design-preview"
                alt="Design"
              />
            )}
                <p><strong>Update Status:</strong>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      axios.put(`http://localhost:5000/api/orders/status/${order._id}`, {
                        status: e.target.value,
                      }).then(fetchOrders)
                    }
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
