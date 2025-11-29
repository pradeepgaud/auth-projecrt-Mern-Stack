// import { createContext, useState } from "react";

// export default AppContent = createContext();

// export const AppContextProvider = (props) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [isLoggedin, setLoggedin] = useState(false);
//   const [userData, setUserData] = useState(false);

//   const value = {
//     backendUrl,
//     isLoggedin,
//     setLoggedin,
//     userData,
//     setUserData,
//   };
//   return (
//     <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
//   );
// };

// import axios from "axios";
// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const AppContext = createContext();

// export const AppContextProvider = (props) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [isLoggedin, setIsLoggedin] = useState(false);
//   const [userData, setUserData] = useState(false);

//   const getAuthState = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
//       if (data.success) {
//         setIsLoggedin(true);
//         getUserData();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   const getUserData = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "api/user/data", {
//         withCredentials: true,
//       });

//       if (data.success) {
//         setUserData(data.userData);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   useEffect(() => {
//     getAuthState();
//   }, []);

//   const value = {
//     backendUrl,
//     isLoggedin,
//     setIsLoggedin,
//     userData,
//     setUserData,
//     getUserData,
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };

// export default AppContext;

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AppContext = createContext();

export const AppContextProvider = (props) => {

  // axios.defaults.withCredentials = true
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // <-- No trailing slash
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContext;
