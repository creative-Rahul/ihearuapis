const jwt = require("jsonwebtoken");
const { error } = require("../ApiResponse/apiResponse");
function tokenVendorAuthorisation(req, res, next) {
  const token = req.header("x-auth-token-vendor");
  const language = req.header("x-vendor-language");
  if (!token) {
    return res
      .status(401)
      .json(error("Access Denied. No token provided.", res.statusCode));
  }
  try {
    const decoded = jwt.verify(token, "ultra-security");
    req.vendor = decoded;
    req.vendor.language = language;
    next();
  } catch (ex) {
    return res
      .status(401)
      .json(error("You are not Authenticated Yet", res.statusCode));
  }
}
module.exports = tokenVendorAuthorisation;
