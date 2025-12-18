import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  
  // ✅ DEBUG: Log context data
  useEffect(() => {
    console.log("🔍 [Login Component Mounted]");
    console.log("✅ Backend URL from Context:", backendUrl);
    console.log("✅ Is backendUrl correct?", 
      backendUrl === "https://auth-project-mem-stack.onrender.com" 
      ? "YES ✓" 
      : `NO ❌ (It is: ${backendUrl})`);
  }, [backendUrl]);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // ✅ DEBUG: Log form data
    console.log("📋 [Form Submission Started]");
    console.log("📝 Mode:", state);
    console.log("📧 Email:", email);
    console.log("🔒 Password length:", password.length);
    
    // Validation
    if (!email || !password) {
      toast.error("Email and password are required");
      console.warn("⚠️ Validation failed: Missing email or password");
      return;
    }

    if (state === "Sign Up" && !name) {
      toast.error("Name is required for sign up");
      console.warn("⚠️ Validation failed: Missing name");
      return;
    }

    setIsLoading(true);
    
    try {
      axios.defaults.withCredentials = true;
      
      // ✅ DEBUG: Log the exact URL being called
      const apiEndpoint = state === "Sign Up" ? "register" : "login";
      const fullUrl = `${backendUrl}/api/auth/${apiEndpoint}`;
      
      console.log("🚀 [API Call Details]");
      console.log("🌐 Full URL:", fullUrl);
      console.log("📤 Request Data:", { 
        name: state === "Sign Up" ? name : "Not required for login", 
        email, 
        password: "***" // Don't log actual password
      });
      
      const startTime = Date.now();

      if (state === "Sign Up") {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/register`,
          { name, email, password },
          { 
            withCredentials: true,
            timeout: 30000, // 30 second timeout
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("⏱️ Request took:", Date.now() - startTime, "ms");
        console.log("✅ [Register Response]:", data);

        if (data.success) {
          console.log("🎉 Registration successful!");
          setIsLoggedin(true);
          getUserData();
          navigate("/");
          toast.success("Account created successfully!");
        } else {
          console.warn("⚠️ Registration failed:", data.message);
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password },
          { 
            withCredentials: true,
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("⏱️ Request took:", Date.now() - startTime, "ms");
        console.log("✅ [Login Response]:", data);

        if (data.success) {
          console.log("🎉 Login successful!");
          setIsLoggedin(true);
          getUserData();
          navigate("/");
          toast.success("Login successful!");
        } else {
          console.warn("⚠️ Login failed:", data.message);
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("❌ [API Error Details]:", {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });

      // Specific error handling
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network error! Check if backend is running.");
        console.error("🔌 Network error - Check:");
        console.error("1. Is backend URL correct?", backendUrl);
        console.error("2. Is Render backend running?");
        console.error("3. Check backend URL in browser:", backendUrl);
      } else if (error.response?.status === 404) {
        toast.error("API endpoint not found. Check backend routes.");
        console.error("🔍 404 Error - Possible issues:");
        console.error("1. Wrong URL:", error.config?.url);
        console.error("2. Check if routes exist in backend");
        console.error("3. Try accessing directly:", `${backendUrl}/api/auth/test`);
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again.");
        console.error("💥 Server 500 error - Check backend logs");
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Backend might be sleeping.");
        console.error("⏰ Timeout - Render free tier might be sleeping");
        console.error("First request after sleep takes 30-50 seconds");
      } else {
        toast.error(error.response?.data?.message || error.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Test backend connection on component load
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        console.log("🔗 Testing backend connection...");
        const testUrl = `${backendUrl}/api/auth/test`; // Or just backendUrl
        
        // Try simple fetch to check if backend is reachable
        const response = await fetch(backendUrl, { 
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          console.log("✅ Backend is reachable!");
        } else {
          console.warn("⚠️ Backend returned:", response.status);
        }
      } catch (err) {
        console.error("❌ Cannot reach backend:", err.message);
        console.error("📌 Make sure URL is correct:", backendUrl);
      }
    };

    testBackendConnection();
  }, [backendUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* ✅ DEBUG INFO BOX */}
      <div className="absolute top-20 right-5 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs hidden sm:block">
        <div className="font-bold mb-1">🔍 Debug Info:</div>
        <div>Backend URL: {backendUrl}</div>
        <div>Status: {isLoading ? "⏳ Loading..." : "✅ Ready"}</div>
        <div className="mt-1 text-green-300">
          Correct URL should be: https://auth-project-mem-stack.onrender.com
        </div>
        <button 
          onClick={() => {
            console.log("🔄 Manual debug check:");
            console.log("Current backendUrl:", backendUrl);
            console.log("Expected:", "https://auth-project-mem-stack.onrender.com");
            console.log("Match?", backendUrl.includes("auth-project-mem-stack"));
          }}
          className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Check URL in Console
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

        {/* ✅ SHOW BACKEND URL */}
        <div className="mb-4 p-2 bg-gray-800 rounded text-xs overflow-hidden">
          <div className="font-bold">Backend: </div>
          <div className="truncate">{backendUrl}</div>
          {!backendUrl.includes("auth-project-mem-stack") && (
            <div className="text-red-400 mt-1">
              ⚠️ Warning: URL might be incorrect!
            </div>
          )}
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
            className={`w-full py-2.5 rounded-full text-white font-medium flex items-center justify-center ${
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
        {/* Form End */}

        <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs">
          <div className="font-bold">💡 Debug Tips:</div>
          <ol className="list-decimal pl-4 mt-1 space-y-1">
            <li>Open Browser Console (F12)</li>
            <li>Check for errors in Console tab</li>
            <li>Check Network tab for API calls</li>
            <li>Ensure backend URL is correct</li>
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
