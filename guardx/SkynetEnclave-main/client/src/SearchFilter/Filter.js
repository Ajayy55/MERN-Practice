import React from "react";

const Filter = ({ searchTerm, setSearchTerm, placeholder }) => {
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder || "Search..."}
      />
    </div>
  );
};

export default Filter;
