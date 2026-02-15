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

  const fetchWeather = useCallback(
    async (searchCity) => {
      if (!searchCity) return;

      try {
        setLoading(true);
        setError("");

        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=${unit}&appid=${API_KEY}`
        );

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=${unit}&appid=${API_KEY}`
        );

        setWeather(weatherRes.data);
        setForecast(forecastRes.data);

        const updatedRecent = [
          searchCity,
          ...recent.filter((c) => c.toLowerCase() !== searchCity.toLowerCase()),
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

  
  useEffect(() => {
    fetchWeather(city);
  }, []); 

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [unit]);

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>

      <SearchBar
        onSearch={(value) => {
          setCity(value);
          fetchWeather(value);
        }}
      />

      <RecentSearches searches={recent} onSelect={fetchWeather} />

      <button
        className="unit-toggle"
        onClick={() =>
          setUnit((prev) => (prev === "metric" ? "imperial" : "metric"))
        }
      >
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
