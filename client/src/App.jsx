import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import TailorDashboard from "./pages/TailorDashboard";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/TempDashboardLayout";
import HomeDashboard from "./pages/dashboard/HomeDashboard";
import Orders from "./pages/dashboard/Orders";
import Profile from "./pages/dashboard/Profile";
import BrowseTailors from "./pages/dashboard/BrowseTailors";



function App() {
  return (
    <div className="p-4">
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/customer-dashboard" element={<CustomerDashboard />} />
  <Route path="/tailor-dashboard" element={<TailorDashboard />} />

  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route path="home" element={<HomeDashboard />} />
    <Route path="orders" element={<Orders />} />
    <Route path="tailors" element={<BrowseTailors />} />
    <Route path="profile" element={<Profile />} />
  </Route>
</Routes>
    </div>
  );
}

export default App;
