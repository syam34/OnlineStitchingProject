import { useEffect, useState } from "react";
import axios from "axios";

export default function HomeDashboard() {
  const [user, setUser] = useState({});
  const [tailors, setTailors] = useState([]);
  const [form, setForm] = useState({
    fabric: "",
    design: "",
    tailorId: "",
    shoulder: "",
    neck: "",
    collar: "",
    chest: "",
    waist: "",
    sleeve: ""
  });
  const [file, setFile] = useState(null);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("customerId", user._id);
    formData.append("tailorId", form.tailorId);
    formData.append("fabric", form.fabric);
    formData.append("shoulder", form.shoulder);
    formData.append("neck", form.neck);
    formData.append("collar", form.collar);
    formData.append("chest", form.chest);
    formData.append("waist", form.waist);
    formData.append("sleeve", form.sleeve);
    if (file) formData.append("designFile", file);

    try {
      const res = await axios.post("http://localhost:5000/api/orders/place", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg(res.data.msg);
    } catch (err) {
      console.log(err);
      setMsg("❌ Failed to place order");
    }
  };

  return (
    <div>
      <h2>Welcome back, {user.name}!</h2>
      <p>Role: <strong>{user.role}</strong></p>

      {user.role === "customer" && (
        <>
          <h3>Place a Stitching Order</h3>
          <form onSubmit={handleSubmit}>
            <input name="fabric" placeholder="Fabric type" onChange={handleChange} required />

            {/* Measurements */}
            <input name="shoulder" placeholder="Shoulder Size" onChange={handleChange} required />
            <input name="neck" placeholder="Neck Size" onChange={handleChange} required />
            <input name="collar" placeholder="Collar Size" onChange={handleChange} required />
            <input name="chest" placeholder="Chest Size" onChange={handleChange} required />
            <input name="waist" placeholder="Waist Size" onChange={handleChange} required />
            <input name="sleeve" placeholder="Sleeve Length" onChange={handleChange} required />

            <input type="file" onChange={handleFileChange} accept="image/*" />

            <select name="tailorId" onChange={handleChange} required>
              <option value="">-- Select Tailor --</option>
              {tailors.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            <button type="submit">Place Order</button>
          </form>
          <p>{msg}</p>
        </>
        
      )}

      {user.role === "tailor" && (
        <p>You can manage orders in the Orders tab.</p>
      )}
    </div>
  );
}
