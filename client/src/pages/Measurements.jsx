// Measurements.js
import React from "react";

export default function Measurements({ measurements }) {
  if (!measurements) return <p>No measurements available.</p>;

  return (
    <div className="measurements" style={{ marginTop: "10px", background: "#f9f9f9", padding: "10px" }}>
      <p><strong>Shoulder:</strong> {measurements.shoulder || "N/A"}</p>
      <p><strong>Neck:</strong> {measurements.neck || "N/A"}</p>
      <p><strong>Collar:</strong> {measurements.collar || "N/A"}</p>
      <p><strong>Chest:</strong> {measurements.chest || "N/A"}</p>
      <p><strong>Waist:</strong> {measurements.waist || "N/A"}</p>
      <p><strong>Sleeve:</strong> {measurements.sleeve || "N/A"}</p>
    </div>
  );
}