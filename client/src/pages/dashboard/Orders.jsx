import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js"; // Official Razorpay CDN
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

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

  const handleEditOrder = async (order) => {
    const formData = new FormData();
    formData.append("fabric", order.fabric);
    if (order.newFile) formData.append("designFile", order.newFile);
  
    try {
      await axios.put(`http://localhost:5000/api/orders/edit/${order._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to edit order:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update order.",
      });
    }
  };
  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/delete/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to cancel order.",
      });
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/status/${orderId}`, { status });
      Swal.fire("Updated!", "Order status updated.", "success");
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  const handlePayment = async (orderId) => {
    const res = await loadRazorpayScript();
  
    if (!res) {
      alert("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }
  
    const { data } = await axios.post(`http://localhost:5000/api/payment/create-order`, {
      amount: 500,
      currency: "INR",
    });
  
    const options = {
      key: "rzp_test_BeZSFh7zVBmaAy", // ✅ Your actual key ID
      amount: data.amount,
      currency: data.currency,
      name: "Online Stitching",
      description: "Order Payment",
      order_id: data.id,
      handler: async function (response) {
        // 👉 Payment success here
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
  
        // 🚀 Now update the order status to "Paid"
        await axios.put(`http://localhost:5000/api/orders/status/${orderId}`, {
          status: "Paid",
        });
  
        alert("Order status updated to Paid!");
      },
      prefill: {
        name: user.name,
        email: "customer@example.com",
        contact: "9999999999",
      },
      method: {
        upi: true,  
        card: true,
        netbanking: true,
      },
      theme: {
        color: "#3399cc",
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  

  return (
    <div className="container mt-4">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          
          <div
            key={order._id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <p><strong>Fabric:</strong> {order.fabric}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  backgroundColor: order.status === "Paid" ? "#28a745" : "#f0ad4e",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {order.status}
              </span>
            </p>

            {/* Static measurements */}
            <p><strong>Measurements:</strong></p>
            <ul>
              <li>Shoulder size: {order.measurements?.shoulder || "N/A"}</li>
              <li>Neck: {order.measurements?.neck || "N/A"}</li>
              <li>Collar: {order.measurements?.collar || "N/A"}</li>
              <li>Chest: {order.measurements?.chest || "N/A"}</li>
              <li>Waist: {order.measurements?.waist || "N/A"}</li>
              <li>Sleeve: {order.measurements?.sleeve || "N/A"}</li>
            </ul>
            {/* Customer view */}
            {user.role === "customer" && (
              <>
                <p><strong>Tailor:</strong> {order.tailorId?.name}</p>
                <img
                src={order.design ? `http://localhost:5000${order.design}` : "https://via.placeholder.com/150?text=No+Design"}
                width="150"
                alt="Design"
                style={{ display: "block", marginBottom: "10px" }}
                />

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
                      style={{ marginBottom: "10px", display: "block" }}
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
                      style={{ marginBottom: "10px", display: "block" }}
                    />

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleEditOrder(order)}
                    >
                      Save Changes
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>

                  </div>
                )}
                {order.status === "Completed" && user.role === "customer" && !order.paid && (
                  <button className="btn btn-danger btn-sm"
                  style={{ marginLeft: "10px" }}
                  onClick={()=> handlePayment(order._id)}>Pay Now</button>
                )}

                {order.status === "Completed" && user.role === "tailor" ? (
                  <p style={{ color: "green" }}>Order Completed</p>
                ):null}
                
              </>
            )}

            {/* Tailor view */}
            {user.role === "tailor" && (
              <>
                <p><strong>Customer:</strong> {order.customerId?.name}</p>
                <img src={order.design ? `http://localhost:5000${order.design}` : "https://via.placeholder.com/150?text=No+Design"}
                width="150"
                alt="Design"
                style={{ display: "block", marginBottom: "10px" }}
                />
                <img src="C:\Users\syama\Downloads\sample-shirt.jpeg" width="150" style={{ display: "block", marginBottom: "10px" }} alt="design" />
                <p><strong>Update Status:</strong></p>
                <select
                  className="form-select"
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  style={{ width: "200px" }}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
