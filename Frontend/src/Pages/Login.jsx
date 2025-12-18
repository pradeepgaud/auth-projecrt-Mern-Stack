import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  
  // ✅ EMERGENCY FIX - Hardcode correct backend URL
  const CORRECT_BACKEND_URL = "https://auth-project-mem-stack.onrender.com";
  
  console.log("🔍 [Login Debug]");
  console.log("Context backendUrl:", backendUrl);
  console.log("Using URL:", CORRECT_BACKEND_URL);
  
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  // ✅ Test backend connection on load
  useEffect(() => {
    const testBackend = async () => {
      try {
        console.log("🔗 Testing backend connection...");
        const response = await fetch(CORRECT_BACKEND_URL);
        const data = await response.text();
        console.log("✅ Backend response:", data);
        setDebugInfo(`Backend: ${response.status} OK`);
      } catch (error) {
        console.error("❌ Backend test failed:", error.message);
        setDebugInfo(`Backend: ${error.message}`);
      }
    };
    
    testBackend();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    console.log("🚀 [Form Submission Started]");
    console.log("📝 Mode:", state);
    console.log("📧 Email:", email);
    console.log("🔗 Backend URL:", CORRECT_BACKEND_URL);
    
    // Validation
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
      const url = `${CORRECT_BACKEND_URL}/api/auth/${endpoint}`;
      
      console.log("🌐 Making request to:", url);
      
      const startTime = Date.now();
      
      const { data } = await axios.post(
        url,
        state === "Sign Up" ? { name, email, password } : { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 60000 // 60 seconds for Render free tier
        }
      );
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ Response received in ${responseTime}ms`);
      console.log("📦 Response data:", data);
      
      if (data.success) {
        console.log("🎉 Success! User:", data.user);
        setIsLoggedin(true);
        getUserData();
        navigate("/");
        toast.success(state === "Sign Up" ? "Account created!" : "Login successful!");
      } else {
        console.warn("⚠️ API returned error:", data.message);
        toast.error(data.message);
      }
      
    } catch (error) {
      console.error("❌ [Error Details]:", {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data
      });
      
      // Specific error handling
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Check backend URL and CORS.");
        console.error("💡 Check backend:", CORRECT_BACKEND_URL);
      } else if (error.response?.status === 404) {
        toast.error("API endpoint not found.");
        console.error("🔍 Test endpoint:", `${CORRECT_BACKEND_URL}/api/test`);
      } else if (error.response?.status === 500) {
        toast.error("Server error. Check backend logs.");
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Timeout - Backend might be sleeping (Render free tier). Try again.");
      } else {
        toast.error(error.response?.data?.message || error.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* ✅ DEBUG INFO PANEL */}
      <div className="absolute top-20 right-5 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs">
        <div className="font-bold mb-2 text-yellow-300">🔧 Debug Panel</div>
        <div className="mb-1">
          <span className="text-gray-400">Backend URL:</span>
          <div className="truncate text-green-300">{CORRECT_BACKEND_URL}</div>
        </div>
        <div className="mb-1">
          <span className="text-gray-400">Status:</span>
          <span className={`ml-2 ${debugInfo.includes('OK') ? 'text-green-400' : 'text-red-400'}`}>
            {debugInfo || "Testing..."}
          </span>
        </div>
        <div className="mb-1">
          <span className="text-gray-400">Mode:</span>
          <span className="ml-2">{state}</span>
        </div>
        <button 
          onClick={() => window.open(CORRECT_BACKEND_URL, '_blank')}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-xs"
        >
          Test Backend ↗
        </button>
        <button 
          onClick={() => console.clear()}
          className="mt-1 w-full bg-gray-700 hover:bg-gray-800 px-3 py-1.5 rounded text-xs"
        >
          Clear Console
        </button>
      </div>

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create Your Account"
            : "Login to Your Account!"}
        </p>

        {/* ✅ BACKEND STATUS */}
        <div className={`mb-4 p-3 rounded text-xs ${debugInfo.includes('OK') ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
          <div className="font-bold">
            {debugInfo.includes('OK') ? '✅ Backend Connected' : '❌ Backend Issue'}
          </div>
          <div className="truncate mt-1">{debugInfo}</div>
        </div>

        {/* Form Start */}
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

          <p
            onClick={() => !isLoading && navigate("/reset-password")}
            className={`mb-4 ${isLoading ? 'text-gray-500' : 'text-indigo-500 cursor-pointer'}`}
          >
            Forget password?
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-full text-white font-medium flex items-center justify-center transition-all ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              state
            )}
          </button>
        </form>

        {/* ✅ DEBUG TIPS */}
        <div className="mt-4 p-3 bg-gray-800/50 rounded text-xs">
          <div className="font-bold mb-1">💡 If facing issues:</div>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Open Console (F12)</li>
            <li>Check Network tab</li>
            <li>Wait 30-60s for first request</li>
            <li>Check Render backend logs</li>
          </ol>
        </div>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => !isLoading && setState("Login")}
              className={`${isLoading ? 'text-gray-500' : 'text-blue-400 cursor-pointer underline'}`}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => !isLoading && setState("Sign Up")}
              className={`${isLoading ? 'text-gray-500' : 'text-blue-400 cursor-pointer underline'}`}
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
