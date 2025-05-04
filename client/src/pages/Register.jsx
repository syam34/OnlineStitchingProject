import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    location: "",     // for customer
    shopName: "",     // for tailor
    city: "",
    address: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.msg || "Error registering");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" required onChange={handleChange} />
        <input name="email" placeholder="Email" required onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
        <select name="role" onChange={handleChange} required>
          <option value="customer">Customer</option>
          <option value="tailor">Tailor</option>
        </select>

        <input name="phone" placeholder="Phone Number" required onChange={handleChange} />
        <input name="location" placeholder="Location" required onChange={handleChange} />

        {form.role === "tailor" && (
          <>
            <input name="shopName" placeholder="Shop Name" required onChange={handleChange} />
            <input name="city" placeholder="City" required onChange={handleChange} />
            <input name="address" placeholder="Address" required onChange={handleChange} />
          </>
        )}

        <button type="submit">Register</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
