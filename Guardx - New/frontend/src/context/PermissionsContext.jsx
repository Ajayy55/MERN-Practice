// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { PORT } from '../port/Port';
// import axios from 'axios';

// const PermissionsContext = createContext();
// const userDataKey = 'user'

// export const PermissionsProvider = ({ children }) => {
//   const [userRole, setUserRole] = useState(null);
//   const [permissions, setPermissions] = useState([]);
//   const [user,setUser]=useState(localStorage.getItem(userDataKey))

//   const getPermissions = async (userID) => {
//     // console.log('useriddd',userID);
//     if (userID){
//         try {
//             const url=`${PORT}getPemissions`
//             const response =await axios.post(url,{id:userID});
//             console.log('inside p',response);

//             setPermissions(response?.data?.role?.permissions || []);
//             setUserRole(response?.data?.role || null);

//           } catch (error) {
//             console.error('Error fetching permissions:', error);
//           }
//     }
//   };

//   useEffect(()=>{
//     const user =localStorage.getItem(userDataKey)
//     setUser(user)
//   },[user])

//   useEffect(() => {
//     const initializePermissions = async () => {
//       if (user){
//         await getPermissions(user); // Pass user ID or unique identifier
//         console.log('refreshed efec');
        
//       }
//     };
//     initializePermissions();
//   }, [user]);

//   const hasPermission = (moduleName, action) =>
//     permissions.some(
//       (perm) => perm.moduleName === moduleName && perm.actions.includes(action)
//     );
// // console.log('permissions in context',permissions);

//   return (
//     <PermissionsContext.Provider value={{ userRole, hasPermission,permissions,getPermissions}}>
//       {children}
//     </PermissionsContext.Provider>
//   );
// };

// // Hook for using permissions in any component
// export const usePermissions = () => useContext(PermissionsContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PORT } from '../port/Port';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const PermissionsContext = createContext();
const token =localStorage.getItem('token')
const userDataKey = 'user';

export const PermissionsProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [user, setUser] = useState(localStorage.getItem(userDataKey));
 const [societyRegularEntries,setSocietyRegularEntries]=useState([]);
  const getPermissions = async (userID) => {
        // console.log('useriddd',userID);
        if (userID){
            try {
                const url=`${PORT}getPemissions`
                const response =await axios.post(url,{id:userID});
                // console.log('inside p',response);
    
                setPermissions(response?.data?.role?.permissions || []);
                setUserRole(response?.data?.role || null);
    
              } catch (error) {
                console.error('Error fetching permissions:', error);
              }
        }
      };

  useEffect(()=>{
    if(permissions.length<0){
       getPermissions(user);
       console.log('inside 0');
       
    }
  },[])

  useEffect(() => {
    const initializePermissions = async () => {
      if (user) {
        await getPermissions(user);
      }
    };
    initializePermissions();

    // Listen for changes in `localStorage` for `user`
    const handleStorageChange = (event) => {
      if (event.key === userDataKey) {
        setUser(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const hasPermission = (moduleName, action) =>
    permissions.some(
      (perm) => perm.moduleName === moduleName && perm.actions.includes(action)
    );

  return (
    <PermissionsContext.Provider value={{ userRole, hasPermission, permissions, getPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook for using permissions in any component
export const usePermissions = () => useContext(PermissionsContext);
