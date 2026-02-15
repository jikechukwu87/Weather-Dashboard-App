import React from "react";

const Forecast = ({ data, unit }) => {
  const dailyData = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>
      <div className="forecast-grid">
        {dailyData.map((day, index) => (
          <div key={index} className="forecast-card">
            <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt="icon"
            />
            <p>{Math.round(day.main.temp)}°{unit === "metric" ? "C" : "F"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
