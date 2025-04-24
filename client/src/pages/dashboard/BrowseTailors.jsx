import { useState, useEffect } from "react";

export default function BrowseTailors() {
  const [tailors, setTailors] = useState([]); // All tailors
  const [filteredTailors, setFilteredTailors] = useState([]); // Tailors after filtering
  const [location, setLocation] = useState(""); // Location filter
  const [rating, setRating] = useState(""); // Rating filter

  // Fetch tailors from the API
  useEffect(() => {
    const fetchTailors = async () => {
      try {
        const response = await fetch("/api/tailors");
  
        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched tailors data:", data); // Check if data is empty or structured incorrectly
        setTailors(data);
        setFilteredTailors(data); // Initially, no filters applied
      } catch (error) {
        console.error("Error fetching tailors:", error);
      }
    };
  
    fetchTailors();
  }, []);
  

  // Apply the filter based on location and rating
  const handleFilter = () => {
    let filtered = [...tailors]; // Create a copy of the tailors array to avoid mutating the original one
    console.log("Initial tailors data:", tailors);
    
    // Filter by location if provided
    if (location) {
        filtered = filtered.filter(tailor => 
            tailor.location.toLowerCase().includes(location.toLowerCase())
        );
        console.log("Filtered by location:", filtered);
    }
    
    // Filter by rating if provided
    if (rating) {
        // Convert rating to a number for comparison
        const ratingNumber = parseFloat(rating);
        filtered = filtered.filter(tailor => tailor.rating >= ratingNumber);
        console.log("Filtered by rating:", filtered);
    }

    console.log("Final filtered tailors:", filtered);
    setFilteredTailors(filtered); // Update state with filtered tailors
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
          placeholder="Enter location"
        />
      </div>

      <div>
        <label>Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Enter rating"
        />
      </div>

      <div>
        <button onClick={handleFilter}>Apply Filters</button>
      </div>

      {/* Display filtered tailors */}
      <div>
        <h3>Tailors List:</h3>
        {filteredTailors.length === 0 ? (
          <p>No tailors found matching your criteria.</p>
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
