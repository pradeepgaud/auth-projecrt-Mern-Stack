import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  // ✅ SINGLE & CORRECT BACKEND URL (Render)
  const BACKEND_URL = "https://auth-projecrt-mern-stack.onrender.com";

  const { setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email & Password required");
      return;
    }

    if (state === "Sign Up" && !name) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);

      axios.defaults.withCredentials = true;

      const endpoint =
        state === "Sign Up"
          ? `${BACKEND_URL}/api/auth/register`
          : `${BACKEND_URL}/api/auth/login`;

      const payload =
        state === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data.success) {
        toast.success(
          state === "Sign Up" ? "Account created successfully" : "Login successful"
        );

        setIsLoggedin(true);
        await getUserData();

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.code === "ERR_NETWORK") {
        toast.error("CORS / Backend connection issue");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create Your Account"
            : "Login to Your Account"}
        </p>

        {/* FORM */}
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5c]">
              <img src={assets.person_icon} alt="" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none w-full"
                type="text"
                placeholder="Full Name"
                disabled={loading}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5c]">
            <img src={assets.mail_icon} alt="" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full"
              type="email"
              placeholder="Email Id"
              disabled={loading}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5c]">
            <img src={assets.lock_icon} alt="" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none w-full"
              type="password"
              placeholder="Password"
              disabled={loading}
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forget password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
          >
            {loading ? "Please wait..." : state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
