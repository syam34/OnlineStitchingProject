import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper" style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "240px", background: "#f3f4f6", padding: "20px" }}>
        <h2 style={{ marginBottom: "20px", color: "#2563eb" }}>Perfect Fit</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
  <Link to="home">🏠 Home</Link>
  <Link to="orders">📦 Orders</Link>
  {user?.role === "customer" && (
    <Link to="/dashboard/tailors">Browse Tailors</Link>    // This link will only show for customers
  )}
  <Link to="profile">🙍‍♂️ Profile</Link>
  <button onClick={logout} style={{ marginTop: "20px", background: "#ef4444", color: "white", padding: "10px", border: "none", borderRadius: "4px" }}>
    Logout
  </button>
</nav>

      </aside>

      <main style={{ flex: 1, padding: "30px", background: "#fff" }}>
        <Outlet />
      </main>
    </div>
  );
}
