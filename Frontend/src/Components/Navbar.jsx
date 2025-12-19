import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  axios.defaults.withCredentials = true;

  // ✅ SEND VERIFY OTP
  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`
      );

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 left-0">
      {/* Logo */}
      <img src={assets.logo} alt="logo" className="w-28 sm:w-32" />

      {/* USER MENU */}
      {userData ? (
        <div className="relative group">
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer">
            {userData.name?.[0]?.toUpperCase()}
          </div>

          <div className="absolute hidden group-hover:block right-0 pt-2 z-20">
            <ul className="bg-white shadow-md rounded text-sm min-w-[150px]">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
