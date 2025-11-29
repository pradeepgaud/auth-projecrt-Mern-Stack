import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSend, setIsEmailSend] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmited, seIsOtpSubmited] = useState(false);

  const inputRefs = React.useRef([]);

  // Move to next input
  const handleInput = (e, index) => {
    // allow only digits (optional)
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);

    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlepaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    const pastArray = paste.split("");

    pastArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
          .replace(/[^0-9]/g, "")
          .slice(0, 1);
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  };

  // Send OTP to email
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) {
        setIsEmailSend(true);
        // focus first OTP input after small delay
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Collect OTP from inputs and show password form
  const onSubmitOtp = (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map((el) => (el ? el.value : ""));
    const joinedOtp = otpArray.join("");
    if (joinedOtp.length < 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setOtp(joinedOtp);
    seIsOtpSubmited(true);

    // focus new password field after showing it
    setTimeout(() => {
      const pwdInput = document.querySelector("#new-password-input");
      pwdInput?.focus();
    }, 100);
  };

  // Submit new password to backend
  const onSubmitPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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

      {/* enter email id */}
      {!isEmailSend && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>

          <p className="text-center mb-6 text-indigo-300">
            Enter Your registered email address
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}

      {/* otp input form */}
      {!isOtpSubmited && isEmailSend && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Email Verify OTP
          </h1>

          <p className="text-center mb-6 text-indigo-300">
            Enter the 6 digit code sent to your email id.
          </p>

          <div className="flex justify-between mb-8" onPaste={handlepaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full"
          >
            Submit
          </button>
        </form>
      )}

      {/* enter new password */}
      {isOtpSubmited && isEmailSend && (
        <form
          onSubmit={onSubmitPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4 ">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300 ">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              id="new-password-input"
              type="password"
              placeholder="New password"
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
