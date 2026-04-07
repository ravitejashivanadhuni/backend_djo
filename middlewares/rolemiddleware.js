// const allowRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!req.admin || !roles.includes(req.admin.role)) {
//       return res.status(403).json({
//         message: "Access denied: insufficient permissions",
//       });
//     }
//     next();
//   };
// };

// module.exports = allowRoles;


const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};

module.exports = allowRoles;