import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      console.log("res.data.user:", res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "customer") {
        navigate("/dashboard/home");

      } else {
        navigate("/dashboard/home");
      }
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="container">
  <h2>Login</h2>
  <form onSubmit={handleSubmit}>
    <input name="email" placeholder="Email" onChange={handleChange} />
    <input name="password" type="password" placeholder="Password" onChange={handleChange} />
    <button>Login</button>
    {msg && <p>{msg}</p>}
    <p>
      Don't have an account? <a href="/register">Register</a>
    </p>
  </form>
</div>

  );
}

export default Login;
