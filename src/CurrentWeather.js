import React from "react";

const CurrentWeather = ({ data, unit }) => {
  return (
    <div className="current-weather">
      <h2>{data.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt="weather icon"
      />
      <p>{data.weather[0].description}</p>
      <h3>
        {Math.round(data.main.temp)}°{unit === "metric" ? "C" : "F"}
      </h3>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Wind: {data.wind.speed} {unit === "metric" ? "m/s" : "mph"}</p>
    </div>
  );
};

export default CurrentWeather;
