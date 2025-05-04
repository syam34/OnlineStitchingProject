import { useEffect, useState } from "react";
import axios from "axios";

function CustomerDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [tailors, setTailors] = useState([]);
  const [form, setForm] = useState({ fabric: "", tailorId: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user?.location) {
      axios.get(`http://localhost:5000/api/auth/tailors?location=${user.location}`)
        .then(res => setTailors(res.data))
        .catch(err => console.log(err));
    }
  }, []);

  const handleFileChange = (e) => {
    const media = e.target.files[0];
    setFile(media);
    setPreview(URL.createObjectURL(media));
  };
  
  const analyzeMeasurements = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5001/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMeasurements(res.data);  // Direct OpenCV Flask returns measurements
    } catch (err) {
      console.error("Failed to analyze measurements:", err);
    }
  };

  const handleSubmit = async () => {
    if (!measurements) {
      alert("Analyze the image first before placing order.");
      return;
    }
    const formData = new FormData();
    formData.append('customerId', user._id);
    formData.append('tailorId', form.tailorId);
    formData.append('fabric', form.fabric);
    if (file) formData.append('designFile', file);
    formData.append('measurements', JSON.stringify(measurements)); // saving calculated sizes

    try {
      const res = await axios.post('http://localhost:5000/api/orders/place', formData);
      setMsg(res.data.msg);
    } catch (err) {
      console.error("Failed to place order:", err);
    }
  };

  

  return (
    <div className="container">
      <h2>Welcome, {user.name} (Customer)</h2>
      <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Logout</button>

      <h3>Place a Stitching Order</h3>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width="200" />}

      <button onClick={analyzeMeasurements}>Analyze Measurements</button>

      {measurements && (
        <div>
          <h4>Detected Measurements:</h4>
          <ul>
            {Object.entries(measurements).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>

          <select name="tailorId" onChange={(e) => setForm({ ...form, tailorId: e.target.value })} required>
            <option value="">-- Select Tailor --</option>
            {tailors.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>

          <input name="fabric" placeholder="Fabric type" onChange={(e) => setForm({ ...form, fabric: e.target.value })} required />
          <button type="button" onClick={handleSubmit}>Place Order</button>
        </div>
      )}

      <p>{msg}</p>
    </div>
  );
}

export default CustomerDashboard;
