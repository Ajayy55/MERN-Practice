// src/components/Loader.js
import React from 'react';
import { BounceLoader } from 'react-spinners'; // Choose any spinner you like

const Loader = ({ loading }) => {
  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  };

  return (
    <div style={loaderStyle}>
      <BounceLoader color="#4A90E2" loading={loading} size={60} />
    </div>
  );
};

export default Loader;
