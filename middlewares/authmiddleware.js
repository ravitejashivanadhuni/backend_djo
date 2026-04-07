// const jwt = require("jsonwebtoken");
// const Admin = require("../models/admin");

// const authMiddleware = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       const admin = await Admin.findById(decoded.id).select("-password");

//       // ❌ Admin deleted / invalid
//       if (!admin) {
//         return res.status(401).json({
//           message: "Admin no longer exists. Token invalid.",
//         });
//       }

//       // ⚠️ FORCE PASSWORD RESET LOGIC
//       if (
//         admin.isTempPassword &&
//        !req.originalUrl.includes("/reset-password")
//       ) {
//         return res.status(403).json({
//           message: "Password reset required",
//           requirePasswordReset: true,
//         });
//       }

//       req.admin = admin;
//       next();
//     } else {
//       return res.status(401).json({ message: "No token provided" });
//     }
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // ✅ Fetch admin (lean for performance)
  const admin = await Admin.findById(decoded.id)
    .select("-password")
    .lean();

  if (!admin) {
    return res.status(401).json({
      message: "Admin no longer exists. Token invalid.",
    });
  }

  // 🔥 FORCE PASSWORD RESET LOGIC
  if (
    admin.isTempPassword &&
    !req.originalUrl.includes("/reset-password")
  ) {
    return res.status(403).json({
      message: "Password reset required",
      requirePasswordReset: true,
    });
  }

  // ✅ Attach admin
  req.admin = admin;

  next();
});

module.exports = authMiddleware;