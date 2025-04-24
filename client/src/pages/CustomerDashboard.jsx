import { useEffect, useState } from "react";
import axios from "axios";

function CustomerDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [tailors, setTailors] = useState([]);
  const [form, setForm] = useState({ fabric: "", tailorId: "" });
  const [file, setFile] = useState(null);
  const [fileDetails, setFileDetails] = useState({});
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  if (!user?._id) {
    window.location.href = "/login";
    return null;
  }

  useEffect(() => {
    if (user?.location) {
      axios
        .get(`http://localhost:5000/api/auth/tailors?location=${user.location}`)
        .then((res) => setTailors(res.data))
        .catch((err) => console.log(err));

      axios
        .get(`http://localhost:5000/api/orders/customer/${user._id}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.log(err));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          setFileDetails({
            width: img.width,
            height: img.height,
            sizeKB: (selectedFile.size / 1024).toFixed(2),
            type: selectedFile.type,
          });
        };
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("customerId", user._id);
    formData.append("tailorId", form.tailorId);
    formData.append("fabric", form.fabric);
    if (file) formData.append("designFile", file);

    try {
      const res = await axios.post("http://localhost:5000/api/orders/place", formData);
      setMsg(res.data.msg);
      const updatedOrders = await axios.get(`http://localhost:5000/api/orders/customer/${user._id}`);
      setOrders(updatedOrders.data);
    } catch (err) {
      setMsg("Failed to place order.");
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {user.name} (Customer)</h2>
      <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="logout-btn">
        Logout
      </button>

      <h3>Place a Stitching Order</h3>
      <form onSubmit={handleSubmit}>
        <input name="fabric" placeholder="Fabric" onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {fileDetails.width && (
          <div style={{ marginTop: "10px", color: "#555" }}>
            <p><strong>Image Size:</strong> {fileDetails.sizeKB} KB</p>
            <p><strong>Dimensions:</strong> {fileDetails.width} x {fileDetails.height}</p>
            <p><strong>Type:</strong> {fileDetails.type}</p>
          </div>
        )}
        <select name="tailorId" onChange={handleChange} required>
          <option value="">-- Select Tailor --</option>
          {tailors.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <button type="submit">Place Order</button>
      </form>

      <p>{msg}</p>

      <h3>Your Orders</h3>
      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <p><strong>Fabric:</strong> {order.fabric}</p>
            <p><strong>Tailor:</strong> {order.tailorId?.name}</p>
            <p><strong>Status:</strong> <span className={`status ${order.status.replace(" ", "")}`}>{order.status}</span></p>
            {order.design && (
              <img
                src={`http://localhost:5000${order.design}`}
                className="design-preview"
                alt="Design"
              />
            )}
          </div>
        ))
      ) : (
        <p>No orders yet.</p>
      )}

      </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  videoContainer: {
    marginTop: "40px",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  videoTitle: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
};


export default CustomerDashboard;