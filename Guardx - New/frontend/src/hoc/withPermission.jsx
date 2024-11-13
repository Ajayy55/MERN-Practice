// src/hoc/withPermission.js
import React from 'react';
import { usePermissions } from '../contexts/PermissionsContext';
import { Navigate } from 'react-router-dom'; // Optional: For redirecting if unauthorized

const withPermission = (Component, moduleName, action) => {
  const WrappedComponent = (props) => {
    const { hasPermission } = usePermissions();

    if (!hasPermission(moduleName, action)) {
      // Optional: Redirect or customize message if no permission
      return <div style={{ color: 'red', fontWeight: 'bold' }}>You do not have permission to view this content.</div>;
      // return <Navigate to="/no-access" />; // Uncomment for redirect
    }

    return <Component {...props} />;
  };

  return React.memo(WrappedComponent); // Memoize to prevent unnecessary re-renders
};

export default withPermission;
