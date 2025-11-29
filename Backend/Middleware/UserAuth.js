// import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.json({ success: false, message: `Not Authorized Login Again` });
//   }
//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//     if (tokenDecode.id) {
//       req.body.userId = tokenDecode.id;
//     } else {
//       return res.json({
//         success: false,
//         message: `Not Authorized Login Agein`,
//       });
//     }
//     next();
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export default userAuth;

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.json({ success: false, message: `Not Authorized, Login Again` });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode?.id) {
      req.userId = tokenDecode.id; // FIX: Do not use req.body
      next();
    } else {
      return res.json({
        success: false,
        message: `Not Authorized Login Again`,
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
