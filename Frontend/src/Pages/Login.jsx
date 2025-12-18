import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  
  // ✅ ONLY ONE CORRECT URL - Remove all others
  const BACKEND_URL = "https://auth-projecrt-mern-stack.onrender.com";
  
  console.log("✅ USING BACKEND URL:", BACKEND_URL);
  
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    console.log("🚀 BACKEND URL:", BACKEND_URL);
    
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (state === "Sign Up" && !name) {
      toast.error("Name is required for sign up");
      return;
    }

    setIsLoading(true);
    
    try {
      const endpoint = state === "Sign Up" ? "register" : "login";
      const url = `${BACKEND_URL}/api/auth/${endpoint}`;
      
      console.log("🌐 API URL:", url);
      
      const { data } = await axios.post(
        url,
        state === "Sign Up" ? { name, email, password } : { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 60000
        }
      );
      
      console.log("✅ Response:", data);
      
      if (data.success) {
        toast.success(state === "Sign Up" ? "Account created!" : "Login successful!");
        window.location.href = "/"; // Force refresh
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      console.error("❌ Full Error:", error);
      console.error("❌ Error URL:", error.config?.url);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error(
          <div>
            <div>CORS Error Detected</div>
            <div className="text-xs">Backend URL: {BACKEND_URL}</div>
            <div className="text-xs">Check server.js CORS settings</div>
          </div>
        );
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Test backend immediately
  useEffect(() => {
    console.log("🔗 Testing backend connection to:", BACKEND_URL);
    
    // Open backend in new tab for manual check
    setTimeout(() => {
      window.open(BACKEND_URL, '_blank');
    }, 1000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      
      {/* ✅ BIG WARNING BOX */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-red-900 border-2 border-red-500 text-white p-4 rounded-lg w-11/12 max-w-2xl z-50">
        <div className="font-bold text-lg mb-2">⚠️ CRITICAL FIX NEEDED</div>
        <div className="mb-2">
          <span className="text-yellow-300">Current Backend URL:</span>
          <div className="bg-black p-2 rounded mt-1 font-mono break-all">
            {BACKEND_URL}
          </div>
        </div>
        <div className="text-sm">
          <div className="mb-1">✅ CORRECT: <span className="text-green-300">auth-projecrt-mern-stack.onrender.com</span></div>
          <div className="mb-1">❌ WRONG: <span className="text-red-300 line-through">auth-project-mem-stack.onrender.com</span></div>
        </div>
        <button 
          onClick={() => window.open(BACKEND_URL, '_blank')}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold"
        >
          Open Backend in New Tab
        </button>
      </div>

      <div className="mt-32 bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        {/* Form */}
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none w-full"
                type="text"
                placeholder="Full Name"
                disabled={isLoading}
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none w-full"
              type="email"
              placeholder="Email Id"
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none w-full"
              type="password"
              placeholder="Password"
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:from-indigo-600 hover:to-indigo-950"
          >
            {isLoading ? "Processing..." : state}
          </button>
        </form>

        {/* ✅ DEBUG INFO */}
        <div className="mt-6 p-4 bg-gray-800 rounded text-xs">
          <div className="font-bold mb-2">🔧 Debug Information:</div>
          <div className="mb-1">Frontend: <span className="text-blue-300">auth-projecrt-mern-stack.vercel.app</span></div>
          <div className="mb-1">Backend: <span className="text-green-300">{BACKEND_URL}</span></div>
          <div className="mb-1">CORS: <span className="text-yellow-300">Must allow frontend origin</span></div>
          <div className="mt-3">
            <button 
              onClick={() => {
                console.clear();
                console.log("🔄 Manual Test");
                console.log("Frontend:", window.location.origin);
                console.log("Backend:", BACKEND_URL);
                console.log("Testing CORS...");
                
                // Test CORS
                fetch(BACKEND_URL, { mode: 'no-cors' })
                  .then(() => console.log("✅ Backend reachable (no-cors)"))
                  .catch(err => console.error("❌ Error:", err));
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded"
            >
              Test in Console
            </button>
          </div>
        </div>

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
            Don't have an account?{" "}
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
