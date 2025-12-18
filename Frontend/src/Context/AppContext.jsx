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
  // ✅ FIX: Add fallback URL if env variable not found
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 
    "https://auth-project-mem-stack.onrender.com";

  console.log("Using Backend URL:", backendUrl); // Debug log

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  // ✅ FIX: Configure axios defaults
  axios.defaults.baseURL = backendUrl;
  axios.defaults.withCredentials = true;

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`/api/auth/is-auth`);

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/user/data`);

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
