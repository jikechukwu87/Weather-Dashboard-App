import React, { useState, useEffect,useCallback } from "react";
import axios from "axios";
import SearchBar from "./SearchBar.js";
import CurrentWeather from "./CurrentWeather.js";
import Forecast from "./Forecast.js";
import RecentSearches from "./RecentSearches.js";
import "./App.css";

const API_KEY = "cd3390589f1b3b7cba8df01749f2fbe8";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );

  const fetchWeather = useCallback(async (searchCity) => {
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
        ...recent.filter((c) => c !== searchCity),
      ].slice(0, 5);

      setRecent(updatedRecent);
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
    } catch (err) {
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  });

 useEffect(() => {
  if (Nigeria) {
    fetchWeather(Nigeria);
  }
}, [Nigeria, fetchWeather]);

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>

      <SearchBar onSearch={(value) => { setCity(value); fetchWeather(value); }} />
      <RecentSearches searches={recent} onSelect={fetchWeather} />

      <button
        className="unit-toggle"
        onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
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
