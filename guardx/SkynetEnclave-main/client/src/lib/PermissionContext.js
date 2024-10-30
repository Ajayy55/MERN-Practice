import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { PORT } from "../Api/api";

export const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [hasFetchedPermissions, setHasFetchedPermissions] = useState(false);
  const getUserRole = JSON.parse(localStorage.getItem("userRole"));

  const getRoleData = async () => {
    try {
      let response = await axios.get(`${PORT}/roleGet`);
      const apiRoles = response.data.roles;
      const filteredRoles = apiRoles.filter(
        (item) => item.title === getUserRole
      );

      if (filteredRoles.length > 0) {
        const permissionsData = filteredRoles[0].permissions;
        setPermissions(permissionsData);
        setHasFetchedPermissions(true);
      } else {
        console.error("No matching role found");
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  useEffect(() => {
    getRoleData();
  }, []);

  const checkPermission = (index, action) => {
    return (
      index >= 0 &&
      Array.isArray(permissions[index]?.actions) &&
      permissions[index].actions.includes(action)
    );
  };

  const getPermission = (index) => {
    if (!permissions[index]) return {};

    const actions = permissions[index].actions.reduce((acc, action) => {
      acc[action] = checkPermission(index, action);
      return acc;
    }, {});

    return {
      moduleName: permissions[index].moduleName,
      actions,
    };
  };

  const allPermissions = permissions.map((_, index) => getPermission(index));
  // console.log(allPermissions, "All Permission");
  return (
    <PermissionContext.Provider
      value={{ permissions: allPermissions, setPermissions }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
