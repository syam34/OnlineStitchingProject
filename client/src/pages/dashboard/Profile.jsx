import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa"; // Correct import

export default function Profile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed._id) {
          setUser(parsed);
          setForm(parsed);
        } else {
          console.log("User missing _id");
        }
      } catch (err) {
        console.log("Failed to parse user:", err);
      }
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/update/${user._id}`,
        form
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setIsEditing(false);
      setMsg("✅ Profile updated successfully!");
    } catch (err) {
      console.log("Update error:", err);
      setMsg("❌ Failed to update profile.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Profile</h2>

      {msg && (
        <p style={{ ...styles.msg, color: msg.includes("✅") ? "green" : "red" }}>
          {msg}
        </p>
      )}

      {!isEditing ? (
        <>
          <div style={styles.profileInfo}>
            <div style={styles.userIcon}>
              <FaUserCircle size={80} color="#333" />
            </div>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Phone:</strong> {form.phone}</p>
            <p><strong>Location:</strong> {form.location}</p>

            {form.role === "tailor" && (
              <>
                <p><strong>Shop Name:</strong> {form.shopName}</p>
                <p><strong>City:</strong> {form.city}</p>
                <p><strong>Address:</strong> {form.address}</p>
              </>
            )}
          </div>

          <button style={styles.editButton} onClick={() => setIsEditing(true)}>
            Update Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate} style={styles.form}>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Enter your name"
            style={styles.input}
          />
          <input
            name="email"
            value={form.email || ""}
            disabled
            style={styles.input}
          />
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            placeholder="Enter your phone number"
            style={styles.input}
          />
          <input
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            placeholder="Enter your location"
            style={styles.input}
          />

          {form.role === "tailor" && (
            <>
              <input
                name="shopName"
                value={form.shopName || ""}
                onChange={handleChange}
                placeholder="Enter your shop name"
                style={styles.input}
              />
              <input
                name="city"
                value={form.city || ""}
                onChange={handleChange}
                placeholder="Enter your city"
                style={styles.input}
              />
              <input
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                placeholder="Enter your address"
                style={styles.input}
              />
            </>
          )}

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7f6", // Light background color for modern look
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    border: "1px solid #ddd", // Adding border for better contrast
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    color: "#333",
    marginBottom: "20px",
  },
  msg: {
    textAlign: "center",
    fontSize: "16px",
    marginBottom: "20px",
  },
  profileInfo: {
    marginBottom: "30px",
    textAlign: "center", // Centering profile details
  },
  userIcon: {
    display: "inline-block",
    marginBottom: "20px",
  },
  editButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  submitButton: {
    width: "48%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  cancelButton: {
    width: "48%",
    padding: "12px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
