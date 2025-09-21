import React, { useState } from "react";

function TripPlannerForm() {
  const [form, setForm] = useState({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    interests: "",
    allergies: "",
    medications: "",
    healthConditions: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        "https://9ea4bcc81a8b.ngrok-free.app/api/trip/plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch trip data");

      const data = await res.json();
      console.log("API Response:", data);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Form */}
      {!loading && !error && !result && (
        <div className="form-card">
          <h1>✈️ AI Trip Planner</h1>
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-row">
              <div>
                <label>Source</label>
                <input
                  type="text"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label>Budget (INR)</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. 20000"
            />

            <label>Interests</label>
            <textarea
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="e.g. beaches, historical sites"
            />

            <div className="form-row">
              <div>
                <label>Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Medications</label>
                <input
                  type="text"
                  name="medications"
                  value={form.medications}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Health Conditions</label>
                <input
                  type="text"
                  name="healthConditions"
                  value={form.healthConditions}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit">🚀 Generate Itinerary</button>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Planning your trip...</h2>
          <p>
            Our AI is analyzing your preferences and generating a personalized
            plan ✨
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-container">
          <h2>❌ Oops! Something went wrong.</h2>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Try Again</button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="result-card">
          <h2>Your Trip Plan 🌍</h2>

          <h3>📅 Itinerary</h3>
          {result.itinerary?.days?.length > 0 ? (
            <ul>
              {result.itinerary.days.map((day, idx) => (
                <li key={idx}>{day}</li>
              ))}
            </ul>
          ) : (
            <p>No itinerary available.</p>
          )}

          <h3>🛣️ Route Info</h3>
          {result.routeInfo ? (
            <p>
              Distance: {(result.routeInfo.distance / 1000).toFixed(1)} km
              <br />
              Duration: {(result.routeInfo.duration / 3600).toFixed(1)} hrs
              <br />
              <a
                href={result.routeInfo.routeMapUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Map
              </a>
            </p>
          ) : (
            <p>No route info available.</p>
          )}

          <h3>☀️ Weather</h3>
          {result.weatherInfo ? (
            <p>{result.weatherInfo.forecastSummary}</p>
          ) : (
            <p>No weather info available.</p>
          )}

          <h3>🏥 Nearby Hospitals</h3>
          {result.nearbyHospitals?.length > 0 ? (
            <ul>
              {result.nearbyHospitals.map((h, idx) => (
                <li key={idx}>
                  <b>{h.name}</b> - {h.address} (📞 {h.contact})
                </li>
              ))}
            </ul>
          ) : (
            <p>No hospitals found nearby.</p>
          )}

          <button onClick={() => setResult(null)}>✨ Plan Another Trip</button>
        </div>
      )}
    </div>
  );
}

export default TripPlannerForm;



