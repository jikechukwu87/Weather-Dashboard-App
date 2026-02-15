import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import RecentSearches from "./RecentSearches";
import "./App.css";

const API_KEY = "cd3390589f1b3b7cba8df01749f2fbe8";


function App() {
  const [city, setCity] = useState("Lagos");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [recent, setRecent] = useState(() => {
    try {
      const stored = localStorage.getItem("recentSearches");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ✅ Stable fetch function
  const fetchWeather = useCallback(
    async (cityName) => {
      if (!cityName) return;

      try {
        setLoading(true);
        setError("");

        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`
        );

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unit}&appid=${API_KEY}`
        );

        setWeather(weatherRes.data);
        setForecast(forecastRes.data);

        const updatedRecent = [
          cityName,
          ...recent.filter(
            (c) => c.toLowerCase() !== cityName.toLowerCase()
          ),
        ].slice(0, 5);

        setRecent(updatedRecent);
        localStorage.setItem(
          "recentSearches",
          JSON.stringify(updatedRecent)
        );
      } catch (err) {
        console.error(err);
        setError("City not found or API error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [unit, recent]
  );

  // ✅ Proper dependency usage (Fixes Netlify CI error)
  useEffect(() => {
    if (!city) return;
    fetchWeather(city);
  }, [city, fetchWeather]);

  // Unit toggle handler
  const handleUnitToggle = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>

      <SearchBar
        onSearch={(value) => {
          setCity(value);
        }}
      />

      <RecentSearches
        searches={recent}
        onSelect={(selectedCity) => {
          setCity(selectedCity);
        }}
      />

      <button className="unit-toggle" onClick={handleUnitToggle}>
        Switch to {unit === "metric" ? "°F" : "°C"}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && <CurrentWeather data={weather} unit={unit} />}
      {forecast && <Forecast data={forecast} unit={unit} />}
    </div>
  );
}

export default App;
