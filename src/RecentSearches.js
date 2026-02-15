import React from "react";

const RecentSearches = ({ searches, onSelect }) => {
  return (
    <div className="recent-searches">
      {searches.map((city, index) => (
        <button key={index} onClick={() => onSelect(city)}>
          {city}
        </button>
      ))}
    </div>
  );
};

export default RecentSearches;
