import { useEffect, useState } from "react";
import axios from "axios";

export default function HomeDashboard() {
  const [user, setUser] = useState({});
  const [tailors, setTailors] = useState([]);
  const [form, setForm] = useState({ fabric: "", tailorId: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u || {});
    if (u?.role === "customer" && u?.location) {
      axios
        .get(`http://localhost:5000/api/auth/tailors?location=${u.location}`)
        .then((res) => setTailors(res.data))
        .catch((err) => console.log(err));
    }
  }, []);

  const handleFileChange = (e) => {
    const media = e.target.files[0];
    setFile(media);
    setPreview(URL.createObjectURL(media));
  };

  // Analyze measurements from AI server
  const analyzeMeasurements = async () => {
    try {
      const formData = new FormData();
      formData.append("media", file);
      const res = await axios.post("http://localhost:5001/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMeasurements(res.data.measurements);  // Save measurements
      console.log("Detected Measurements:", res.data.measurements);
    } catch (err) {
      console.error("Error analyzing measurements:", err);
      setMsg("❌ Failed to analyze image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("customerId", user._id);
    formData.append("tailorId", form.tailorId);
    formData.append("fabric", form.fabric);
    if (file) formData.append("designFile", file);
    if (measurements) formData.append("measurements", JSON.stringify(measurements));

    try {
      const res = await axios.post("http://localhost:5000/api/orders/place", formData);
      setMsg(res.data.msg);
    } catch (err) {
      console.error("Error placing order:", err);
      setMsg("❌ Failed to place order");
    }
  };

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Role: <strong>{user.role}</strong></p>

      {user.role === "customer" && (
        <>
          <h3>Place a Stitching Order</h3>
          <form onSubmit={handleSubmit}>
            <input name="fabric" placeholder="Fabric type" onChange={(e) => setForm({ ...form, fabric: e.target.value })} required />

            <input type="file" accept="image/*" onChange={handleFileChange} />

            {preview && <img src={preview} alt="Preview" style={{ width: "200px", margin: "10px 0" }} />}

            <button type="button" onClick={analyzeMeasurements}>Analyze Measurements</button>

            {measurements && (
              <div style={{ marginTop: "20px", background: "#f8f8f8", padding: "10px", borderRadius: "5px" }}>
                <h4>Detected Measurements:</h4>
                <ul>
                  {Object.entries(measurements).map(([key, value]) => (
                    <li key={key}>{key}: {value} cm</li>
                  ))}
                </ul>
              </div>
            )}

            <select name="tailorId" onChange={(e) => setForm({ ...form, tailorId: e.target.value })} required>
              <option value="">-- Select Tailor --</option>
              {tailors.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>

            <button type="submit">Place Order</button>
          </form>

          <p style={{ marginTop: "10px", color: "green" }}>{msg}</p>
        </>
      )}

      {user.role === "tailor" && (
        <p>You can manage orders in the Orders tab.</p>
      )}
    </div>
  );
}
