import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModle from "../Models/UserModel.js";
import transporter from "../Config/NodeMailer.js";

// export const register = async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//     return res.json({ success: false, message: "Missing Details" });
//   }
//   try {
//     const existingUser = await userModle.findOne({ email });

//     if (existingUser) {
//       return res.json({ success: false, message: "User alreday exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new userModle({ name, email, password: hashedPassword });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//       maxAge: 7 * 24 * 60 * 60 * 100,
//     });

//     // sending welcome mail

//     const mailOptsions = {
//       from:process.env.SENDER_EMAIL,
//       to:email,
//       subject:"Welcome to my auth site",
//       text:`Welcome to my site your account has been created with email id: ${email}`
//     }

//     await  transporter.sendMail(mailOptsions)
//     return res.json({success:true})

//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }
  try {
    const existingUser = await userModle.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModle({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms (use *1000)
    });

    // mail options
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Pradeep MernAuth Web Site.",
      text: `Welcome to Pradeep MernAuth Web Site. Your account has been created with email id:${email}`,
    };

    // send mail but don't fail whole flow if it errors
    let emailSent = true;
    // try {
    //   await transporter.sendMail(mailOptions);
    // } catch (mailErr) {
    //   console.error("Mail send error:", mailErr.message);
    //   emailSent = false;
    // }
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS);

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error("Mail send error:", mailErr.message);
      emailSent = false;
    }

    return res.status(201).json({ success: true, emailSent, userId: user._id });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// login controllers

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password are required",
    });
  }
  try {
    const user = await userModle.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    1;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 100,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// sendVerifyOpt
// export const sendVerifyOpt = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const user = await userModle.findById(userId);

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     if (user.isAccountVerified) {
//       return res.json({ success: false, message: "Account Already verified" });

//       user.verifyOtp = otp;
//       user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
//       await user.save();

//       const mailOptions = {
//         from: process.env.SENDER_EMAIL,
//         to: user.email,
//         subject: "Account Veryification OTP",
//         text: `Your OTP id ${otp}. Verify your account using this OTP`,
//       };
//       await transporter.sendMail(mailOptions);
//       res.json({ success: true, message: `Verification OTP Senton Email` });
//     }
//     const otp = String(Math.floor(100000 + Math.round() * 900000));
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const sendVerifyOpt = async (req, res) => {
//   try {
//     // const { userId } = req.body;
//     const userId = req.userId;
//     const user = await userModle.findById(userId);

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     if (user.isAccountVerified) {
//       return res.json({
//         success: false,
//         message: "Account already verified",
//       });
//     }

//     // Generate OTP
//     const otp = String(Math.floor(100000 + Math.random() * 900000));

//     // Save OTP to DB
//     user.verifyOtp = otp;
//     user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
//     await user.save();

//     // Send mail
//     const mailOptions = {
//       from: process.env.SENDER_EMAIL,
//       to: user.email,
//       subject: "Account Verification OTP",
//       text: `Your OTP is ${otp}. Use this to verify your account.`,
//     };

//     await transporter.sendMail(mailOptions);

//     return res.json({ success: true, message: "OTP sent to email" });
//   } catch (error) {
//     console.log("OTP error:", error);
//     return res.json({ success: false, message: error.message });
//   }
// };

export const sendVerifyOpt = async (req, res) => {
  try {
    const userId = req.userId; // FIXED: Taking from middleware

    const user = await userModle.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Use this to verify your account.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log("OTP error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// VerifyEmail

// export const verifyEmail = async (req, res) => {
//   const { otp } = req.body;

//   if (!userId || !otp) {
//     return res.json({ success: false, message: `Missing Details ` });
//   }
//   try {
//     const user = await userModle.findById(userId);

//     if (!user) {
//       return res.json({ success: false, message: `User not found` });
//     }

//     if (user.verifyOtp === "" || user.verifyOtp !== otp) {
//       return res.json({ success: false, message: `Invalid OTP` });
//     }

//     if (user.verifyOtpExpireAt < Date.now()) {
//       return res.json({ success: false, message: `OTP Expired` });
//     }

//     user.isAccountVerified = true;
//     user.verifyOtp = "";
//     user.verifyOtpExpireAt = 0;

//     await user.save();
//     return res.json({ success: true, message: `Email verifyied successfully` });
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };
export const verifyEmail = async (req, res) => {
  try {
    const userId = req.userId; // FIXED: userId from middleware
    const { otp } = req.body;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await userModle.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// send password reset otp

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModle.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save OTP to DB
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Send mail
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}.
Use this OTP to proceed with resetting your password.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: `OTP sent to your email` });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset User Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: `Email, OTP, and new password are required`,
    });
  }

  try {
    const user = await userModle.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: `User not found` });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: `Invalid OTP`,
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: `OTP Expired`,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: `Password has been reset successfully`,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
