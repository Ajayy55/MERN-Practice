import React from 'react';
import { NavLink } from 'react-router-dom';

const PermissionedNavLink = ({ to, permissions, children }) => {
  return (
    permissions && permissions.value ? (
      <NavLink className="nav-link" to={to}>
        {children}
      </NavLink>
    ) : null
  );
};

export default PermissionedNavLink;
