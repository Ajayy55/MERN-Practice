import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const DateAndTimeFilter = ({ onDateFilter, onDateClearFilter }) => {
  const [date, setDate] = useState("");

  const handleDateFilter = () => {
    onDateFilter(date);
  };
  const handleDateClearFilter = () => {
    setDate("");
    onDateClearFilter();
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <TextField
        label="Select Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" onClick={handleDateFilter}>
        Filter
      </Button>
      <Button variant="contained" onClick={handleDateClearFilter}>
        Clear
      </Button>
    </div>
  );
};

export default DateAndTimeFilter;
