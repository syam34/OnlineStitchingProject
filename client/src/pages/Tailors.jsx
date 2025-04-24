import { useState, useEffect } from "react";

export default function BrowseTailors() {
  const [tailors, setTailors] = useState([]);
  const [filteredTailors, setFilteredTailors] = useState([]);
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    // Simulate an API call to fetch tailors
    const fetchTailors = async () => {
        try {
          const response = await fetch("/api/tailors");
          const text = await response.text(); // Get the raw response as text
          console.log(text); // Log the response body
          const data = JSON.parse(text); // Try to parse as JSON
          setTailors(data);
        } catch (error) {
          console.error("Error fetching tailors:", error);
        }
      };
      

    fetchTailors();
  }, []);

  const handleFilter = () => {
    let filtered = tailors;

    if (location) {
      filtered = filtered.filter((tailor) => tailor.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (rating) {
      filtered = filtered.filter((tailor) => tailor.rating >= rating);
    }

    setFilteredTailors(filtered);
  };

  return (
    <div>
      <h2>Browse Tailors</h2>

      <div>
        <label>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label>Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <button onClick={handleFilter}>Apply Filters</button>
      </div>

      <div>
        <h3>Tailors List:</h3>
        {filteredTailors.length === 0 ? (
          <p>No tailors match your filter criteria.</p>
        ) : (
          filteredTailors.map((tailor) => (
            <div key={tailor.id}>
              <h4>{tailor.name}</h4>
              <p>Location: {tailor.location}</p>
              <p>Rating: {tailor.rating}</p>
                <p>Experience: {tailor.experience} years</p>
              <p>Contact: {tailor.contact}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
